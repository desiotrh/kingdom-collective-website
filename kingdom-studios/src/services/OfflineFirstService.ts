import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import { useTierSystem } from '../contexts/TierSystemContext';

export interface OfflineData {
    key: string;
    data: any;
    timestamp: Date;
    syncStatus: 'pending' | 'synced' | 'failed';
    retryCount: number;
}

export interface SyncQueue {
    id: string;
    action: 'create' | 'update' | 'delete';
    resource: string;
    data: any;
    timestamp: Date;
    priority: 'high' | 'medium' | 'low';
}

export interface CacheConfig {
    maxSize: number; // MB
    ttl: number; // Time to live in milliseconds
    priority: 'high' | 'medium' | 'low';
}

export interface NetworkStatus {
    isConnected: boolean;
    isInternetReachable: boolean;
    type: string;
    isWifi: boolean;
    isCellular: boolean;
}

export class OfflineFirstService {
    private static instance: OfflineFirstService;
    private syncQueue: SyncQueue[] = [];
    private offlineData: Map<string, OfflineData> = new Map();
    private networkStatus: NetworkStatus = {
        isConnected: true,
        isInternetReachable: true,
        type: 'unknown',
        isWifi: false,
        isCellular: false,
    };
    private listeners: ((status: NetworkStatus) => void)[] = [];

    static getInstance(): OfflineFirstService {
        if (!OfflineFirstService.instance) {
            OfflineFirstService.instance = new OfflineFirstService();
            OfflineFirstService.instance.initializeNetworkMonitoring();
        }
        return OfflineFirstService.instance;
    }

    // Network Status Monitoring
    private initializeNetworkMonitoring(): void {
        NetInfo.addEventListener(state => {
            this.networkStatus = {
                isConnected: state.isConnected || false,
                isInternetReachable: state.isInternetReachable || false,
                type: state.type || 'unknown',
                isWifi: state.type === 'wifi',
                isCellular: state.type === 'cellular',
            };

            // Notify listeners
            this.listeners.forEach(listener => listener(this.networkStatus));

            // Handle network changes
            if (this.networkStatus.isConnected && this.networkStatus.isInternetReachable) {
                this.processSyncQueue();
            }
        });
    }

    // Network Status
    getNetworkStatus(): NetworkStatus {
        return this.networkStatus;
    }

    addNetworkListener(listener: (status: NetworkStatus) => void): () => void {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    // Data Caching
    async cacheData(key: string, data: any, config: Partial<CacheConfig> = {}): Promise<void> {
        try {
            const cacheConfig: CacheConfig = {
                maxSize: 50, // 50MB default
                ttl: 24 * 60 * 60 * 1000, // 24 hours default
                priority: 'medium',
                ...config,
            };

            const offlineData: OfflineData = {
                key,
                data,
                timestamp: new Date(),
                syncStatus: 'pending',
                retryCount: 0,
            };

            // Store in memory
            this.offlineData.set(key, offlineData);

            // Store in AsyncStorage
            await AsyncStorage.setItem(key, JSON.stringify(offlineData));

            // Check cache size and clean if necessary
            await this.cleanupCache();
        } catch (error) {
            console.error('Failed to cache data:', error);
        }
    }

    async getCachedData(key: string): Promise<any | null> {
        try {
            // Try memory first
            const memoryData = this.offlineData.get(key);
            if (memoryData) {
                // Check if data is still valid
                if (this.isDataValid(memoryData)) {
                    return memoryData.data;
                } else {
                    // Remove expired data
                    this.offlineData.delete(key);
                    await AsyncStorage.removeItem(key);
                }
            }

            // Try AsyncStorage
            const storageData = await AsyncStorage.getItem(key);
            if (storageData) {
                const offlineData: OfflineData = JSON.parse(storageData);
                if (this.isDataValid(offlineData)) {
                    // Update memory cache
                    this.offlineData.set(key, offlineData);
                    return offlineData.data;
                } else {
                    // Remove expired data
                    await AsyncStorage.removeItem(key);
                }
            }

            return null;
        } catch (error) {
            console.error('Failed to get cached data:', error);
            return null;
        }
    }

    private isDataValid(offlineData: OfflineData): boolean {
        const now = new Date().getTime();
        const dataAge = now - offlineData.timestamp.getTime();
        const ttl = 24 * 60 * 60 * 1000; // 24 hours default
        return dataAge < ttl;
    }

    private async cleanupCache(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const dataKeys = keys.filter(key => key.startsWith('cache_'));

            let totalSize = 0;
            const cacheEntries: { key: string; size: number; timestamp: Date }[] = [];

            for (const key of dataKeys) {
                const data = await AsyncStorage.getItem(key);
                if (data) {
                    const size = new Blob([data]).size;
                    const offlineData: OfflineData = JSON.parse(data);
                    totalSize += size;
                    cacheEntries.push({
                        key,
                        size,
                        timestamp: offlineData.timestamp,
                    });
                }
            }

            const maxSize = 50 * 1024 * 1024; // 50MB
            if (totalSize > maxSize) {
                // Sort by timestamp (oldest first)
                cacheEntries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

                // Remove oldest entries until under limit
                for (const entry of cacheEntries) {
                    await AsyncStorage.removeItem(entry.key);
                    this.offlineData.delete(entry.key);
                    totalSize -= entry.size;
                    if (totalSize <= maxSize * 0.8) { // Keep 20% buffer
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to cleanup cache:', error);
        }
    }

    // Sync Queue Management
    async addToSyncQueue(action: SyncQueue['action'], resource: string, data: any, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<string> {
        const syncItem: SyncQueue = {
            id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            action,
            resource,
            data,
            timestamp: new Date(),
            priority,
        };

        this.syncQueue.push(syncItem);

        // Store in AsyncStorage
        await AsyncStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));

        // Process queue if online
        if (this.networkStatus.isConnected && this.networkStatus.isInternetReachable) {
            this.processSyncQueue();
        }

        return syncItem.id;
    }

    async processSyncQueue(): Promise<void> {
        if (!this.networkStatus.isConnected || !this.networkStatus.isInternetReachable) {
            return;
        }

        if (this.syncQueue.length === 0) {
            return;
        }

        // Sort by priority and timestamp
        this.syncQueue.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const aPriority = priorityOrder[a.priority];
            const bPriority = priorityOrder[b.priority];

            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }

            return a.timestamp.getTime() - b.timestamp.getTime();
        });

        const itemsToProcess = [...this.syncQueue];
        this.syncQueue = [];

        for (const item of itemsToProcess) {
            try {
                await this.processSyncItem(item);
            } catch (error) {
                console.error('Failed to process sync item:', error);
                // Re-add to queue with retry count
                item.retryCount = (item.retryCount || 0) + 1;
                if (item.retryCount < 3) {
                    this.syncQueue.push(item);
                }
            }
        }

        // Update AsyncStorage
        await AsyncStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
    }

    private async processSyncItem(item: SyncQueue): Promise<void> {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Mock success/failure
        if (Math.random() > 0.1) { // 90% success rate
            console.log(`Successfully synced: ${item.action} ${item.resource}`);
        } else {
            throw new Error(`Failed to sync: ${item.action} ${item.resource}`);
        }
    }

    async getSyncQueueStatus(): Promise<{
        pending: number;
        processing: number;
        failed: number;
        queue: SyncQueue[];
    }> {
        const pending = this.syncQueue.filter(item => item.retryCount === 0).length;
        const processing = this.syncQueue.filter(item => item.retryCount > 0 && item.retryCount < 3).length;
        const failed = this.syncQueue.filter(item => item.retryCount >= 3).length;

        return {
            pending,
            processing,
            failed,
            queue: [...this.syncQueue],
        };
    }

    // Offline Data Management
    async saveOfflineData(key: string, data: any): Promise<void> {
        const offlineData: OfflineData = {
            key,
            data,
            timestamp: new Date(),
            syncStatus: 'pending',
            retryCount: 0,
        };

        this.offlineData.set(key, offlineData);
        await AsyncStorage.setItem(`offline_${key}`, JSON.stringify(offlineData));
    }

    async getOfflineData(key: string): Promise<any | null> {
        const memoryData = this.offlineData.get(key);
        if (memoryData) {
            return memoryData.data;
        }

        try {
            const storageData = await AsyncStorage.getItem(`offline_${key}`);
            if (storageData) {
                const offlineData: OfflineData = JSON.parse(storageData);
                this.offlineData.set(key, offlineData);
                return offlineData.data;
            }
        } catch (error) {
            console.error('Failed to get offline data:', error);
        }

        return null;
    }

    async markDataAsSynced(key: string): Promise<void> {
        const offlineData = this.offlineData.get(key);
        if (offlineData) {
            offlineData.syncStatus = 'synced';
            await AsyncStorage.setItem(`offline_${key}`, JSON.stringify(offlineData));
        }
    }

    // AI Prompt Caching
    async cacheAIPrompt(prompt: string, response: string, platform: string): Promise<void> {
        const key = `ai_prompt_${platform}_${Date.now()}`;
        await this.cacheData(key, {
            prompt,
            response,
            platform,
            timestamp: new Date(),
        }, {
            ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
            priority: 'high',
        });
    }

    async getCachedAIPrompt(prompt: string, platform: string): Promise<string | null> {
        const keys = await AsyncStorage.getAllKeys();
        const aiKeys = keys.filter(key => key.startsWith('ai_prompt_') && key.includes(platform));

        for (const key of aiKeys) {
            const data = await this.getCachedData(key);
            if (data && data.prompt === prompt) {
                return data.response;
            }
        }

        return null;
    }

    // Template Caching
    async cacheTemplates(templates: any[]): Promise<void> {
        await this.cacheData('templates', templates, {
            ttl: 24 * 60 * 60 * 1000, // 24 hours
            priority: 'high',
        });
    }

    async getCachedTemplates(): Promise<any[] | null> {
        return await this.getCachedData('templates');
    }

    // Draft Management
    async saveDraft(draftId: string, content: any): Promise<void> {
        await this.saveOfflineData(`draft_${draftId}`, {
            content,
            lastModified: new Date(),
        });
    }

    async getDraft(draftId: string): Promise<any | null> {
        return await this.getOfflineData(`draft_${draftId}`);
    }

    async getAllDrafts(): Promise<{ id: string; content: any; lastModified: Date }[]> {
        const keys = await AsyncStorage.getAllKeys();
        const draftKeys = keys.filter(key => key.startsWith('offline_draft_'));

        const drafts = [];
        for (const key of draftKeys) {
            const draftId = key.replace('offline_draft_', '');
            const data = await this.getOfflineData(`draft_${draftId}`);
            if (data) {
                drafts.push({
                    id: draftId,
                    content: data.content,
                    lastModified: data.lastModified,
                });
            }
        }

        return drafts.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    }

    // Storage Management
    async getStorageInfo(): Promise<{
        totalSize: number;
        cacheSize: number;
        offlineDataSize: number;
        syncQueueSize: number;
    }> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            let totalSize = 0;
            let cacheSize = 0;
            let offlineDataSize = 0;
            let syncQueueSize = 0;

            for (const key of keys) {
                const data = await AsyncStorage.getItem(key);
                if (data) {
                    const size = new Blob([data]).size;
                    totalSize += size;

                    if (key.startsWith('cache_')) {
                        cacheSize += size;
                    } else if (key.startsWith('offline_')) {
                        offlineDataSize += size;
                    } else if (key === 'sync_queue') {
                        syncQueueSize += size;
                    }
                }
            }

            return {
                totalSize,
                cacheSize,
                offlineDataSize,
                syncQueueSize,
            };
        } catch (error) {
            console.error('Failed to get storage info:', error);
            return {
                totalSize: 0,
                cacheSize: 0,
                offlineDataSize: 0,
                syncQueueSize: 0,
            };
        }
    }

    async clearCache(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith('cache_'));

            for (const key of cacheKeys) {
                await AsyncStorage.removeItem(key);
                this.offlineData.delete(key);
            }
        } catch (error) {
            console.error('Failed to clear cache:', error);
        }
    }

    async clearOfflineData(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const offlineKeys = keys.filter(key => key.startsWith('offline_'));

            for (const key of offlineKeys) {
                await AsyncStorage.removeItem(key);
                this.offlineData.delete(key.replace('offline_', ''));
            }
        } catch (error) {
            console.error('Failed to clear offline data:', error);
        }
    }

    // Utility Methods
    isOnline(): boolean {
        return this.networkStatus.isConnected && this.networkStatus.isInternetReachable;
    }

    async waitForConnection(): Promise<void> {
        return new Promise((resolve) => {
            if (this.isOnline()) {
                resolve();
                return;
            }

            const unsubscribe = this.addNetworkListener((status) => {
                if (status.isConnected && status.isInternetReachable) {
                    unsubscribe();
                    resolve();
                }
            });
        });
    }
}

export default OfflineFirstService.getInstance(); 