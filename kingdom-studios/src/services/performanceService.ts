import { analyticsService } from './analyticsService';
import { authService } from './authService';

export interface CloudRenderJob {
    id: string;
    projectId: string;
    userId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    settings: {
        resolution: '720p' | '1080p' | '4K' | '8K';
        format: 'mp4' | 'mov' | 'avi' | 'webm';
        quality: 'low' | 'medium' | 'high' | 'ultra';
        fps: number;
        bitrate: number;
    };
    progress: number;
    estimatedTime: number;
    startedAt?: Date;
    completedAt?: Date;
    outputUrl?: string;
    errorMessage?: string;
}

export interface BatchJob {
    id: string;
    name: string;
    description: string;
    userId: string;
    projects: string[];
    operation: 'render' | 'export' | 'optimize' | 'convert';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    totalJobs: number;
    completedJobs: number;
    failedJobs: number;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    results: BatchJobResult[];
}

export interface BatchJobResult {
    projectId: string;
    status: 'success' | 'failed';
    outputUrl?: string;
    errorMessage?: string;
    processingTime: number;
}

export interface AutoBackup {
    id: string;
    projectId: string;
    userId: string;
    type: 'auto' | 'manual' | 'scheduled';
    timestamp: Date;
    version: number;
    size: number;
    data: any;
    isCompressed: boolean;
    backupUrl: string;
    restoreUrl: string;
}

export interface OfflineProject {
    id: string;
    name: string;
    description: string;
    userId: string;
    tracks: any[];
    settings: any;
    lastModified: Date;
    size: number;
    isSynced: boolean;
    syncStatus: 'pending' | 'syncing' | 'completed' | 'failed';
}

export interface PerformanceMetrics {
    renderTime: number;
    exportTime: number;
    fileSize: number;
    quality: number;
    compressionRatio: number;
    memoryUsage: number;
    cpuUsage: number;
    networkUsage: number;
}

class PerformanceService {
    private apiBaseUrl: string;
    private isOnline: boolean = navigator.onLine;

    constructor() {
        this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
        this.setupOnlineStatusListener();
    }

    /**
     * Setup online/offline status listener
     */
    private setupOnlineStatusListener(): void {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineProjects();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    /**
     * Submit cloud render job
     */
    async submitCloudRender(
        projectId: string,
        settings: CloudRenderJob['settings'],
        priority: CloudRenderJob['priority'] = 'normal'
    ): Promise<CloudRenderJob> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/performance/cloud-render`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    projectId,
                    settings,
                    priority,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit cloud render job');
            }

            const job = await response.json();

            analyticsService.trackEvent('cloud_render_submitted', {
                userId: user.uid,
                projectId,
                resolution: settings.resolution,
                priority,
            });

            return job;
        } catch (error) {
            console.error('Cloud render submission failed:', error);
            throw error;
        }
    }

    /**
     * Get cloud render job status
     */
    async getCloudRenderStatus(jobId: string): Promise<CloudRenderJob> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/performance/cloud-render/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get cloud render status');
            }

            const job = await response.json();
            return job;
        } catch (error) {
            console.error('Cloud render status failed:', error);
            throw error;
        }
    }

    /**
     * Cancel cloud render job
     */
    async cancelCloudRender(jobId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/performance/cloud-render/${jobId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to cancel cloud render job');
            }

            analyticsService.trackEvent('cloud_render_cancelled', {
                userId: user.uid,
                jobId,
            });
        } catch (error) {
            console.error('Cloud render cancellation failed:', error);
            throw error;
        }
    }

    /**
     * Create batch job
     */
    async createBatchJob(
        name: string,
        description: string,
        projects: string[],
        operation: BatchJob['operation']
    ): Promise<BatchJob> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/performance/batch-jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    name,
                    description,
                    projects,
                    operation,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create batch job');
            }

            const job = await response.json();

            analyticsService.trackEvent('batch_job_created', {
                userId: user.uid,
                name,
                operation,
                projectCount: projects.length,
            });

            return job;
        } catch (error) {
            console.error('Batch job creation failed:', error);
            throw error;
        }
    }

    /**
     * Get batch job status
     */
    async getBatchJobStatus(jobId: string): Promise<BatchJob> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/performance/batch-jobs/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get batch job status');
            }

            const job = await response.json();
            return job;
        } catch (error) {
            console.error('Batch job status failed:', error);
            throw error;
        }
    }

    /**
     * Cancel batch job
     */
    async cancelBatchJob(jobId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/performance/batch-jobs/${jobId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to cancel batch job');
            }

            analyticsService.trackEvent('batch_job_cancelled', {
                userId: user.uid,
                jobId,
            });
        } catch (error) {
            console.error('Batch job cancellation failed:', error);
            throw error;
        }
    }

    /**
     * Create auto backup
     */
    async createAutoBackup(
        projectId: string,
        type: AutoBackup['type'] = 'auto'
    ): Promise<AutoBackup> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/performance/auto-backup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    projectId,
                    type,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create auto backup');
            }

            const backup = await response.json();

            analyticsService.trackEvent('auto_backup_created', {
                userId: user.uid,
                projectId,
                type,
                size: backup.size,
            });

            return backup;
        } catch (error) {
            console.error('Auto backup creation failed:', error);
            throw error;
        }
    }

    /**
     * Get auto backups
     */
    async getAutoBackups(projectId?: string): Promise<AutoBackup[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = projectId ? `?projectId=${projectId}` : '';
            const response = await fetch(`${this.apiBaseUrl}/performance/auto-backup${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get auto backups');
            }

            const backups = await response.json();

            analyticsService.trackEvent('auto_backups_viewed', {
                userId: user.uid,
                projectId,
                backupCount: backups.length,
            });

            return backups;
        } catch (error) {
            console.error('Auto backups failed:', error);
            return this.generateMockAutoBackups();
        }
    }

    /**
     * Generate mock auto backups
     */
    private generateMockAutoBackups(): AutoBackup[] {
        return [
            {
                id: 'backup_1',
                projectId: 'project_1',
                userId: 'user_1',
                type: 'auto',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                version: 1,
                size: 1024 * 1024 * 5, // 5MB
                data: { tracks: [], settings: {} },
                isCompressed: true,
                backupUrl: 'https://example.com/backup1.zip',
                restoreUrl: 'https://example.com/restore1',
            },
            {
                id: 'backup_2',
                projectId: 'project_1',
                userId: 'user_1',
                type: 'manual',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                version: 2,
                size: 1024 * 1024 * 8, // 8MB
                data: { tracks: [], settings: {} },
                isCompressed: true,
                backupUrl: 'https://example.com/backup2.zip',
                restoreUrl: 'https://example.com/restore2',
            },
        ];
    }

    /**
     * Restore from backup
     */
    async restoreFromBackup(backupId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/performance/auto-backup/${backupId}/restore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to restore from backup');
            }

            analyticsService.trackEvent('backup_restored', {
                userId: user.uid,
                backupId,
            });
        } catch (error) {
            console.error('Backup restoration failed:', error);
            throw error;
        }
    }

    /**
     * Save project offline
     */
    async saveProjectOffline(project: OfflineProject): Promise<void> {
        try {
            // Save to local storage
            const offlineProjects = this.getOfflineProjects();
            const existingIndex = offlineProjects.findIndex(p => p.id === project.id);

            if (existingIndex >= 0) {
                offlineProjects[existingIndex] = project;
            } else {
                offlineProjects.push(project);
            }

            localStorage.setItem('offline_projects', JSON.stringify(offlineProjects));

            analyticsService.trackEvent('project_saved_offline', {
                userId: project.userId,
                projectId: project.id,
                size: project.size,
            });
        } catch (error) {
            console.error('Offline save failed:', error);
            throw error;
        }
    }

    /**
     * Get offline projects
     */
    getOfflineProjects(): OfflineProject[] {
        try {
            const stored = localStorage.getItem('offline_projects');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to get offline projects:', error);
            return [];
        }
    }

    /**
     * Sync offline projects
     */
    async syncOfflineProjects(): Promise<void> {
        if (!this.isOnline) return;

        try {
            const offlineProjects = this.getOfflineProjects();
            const unsyncedProjects = offlineProjects.filter(p => !p.isSynced);

            for (const project of unsyncedProjects) {
                try {
                    await this.syncProject(project);
                    project.isSynced = true;
                    project.syncStatus = 'completed';
                } catch (error) {
                    console.error(`Failed to sync project ${project.id}:`, error);
                    project.syncStatus = 'failed';
                }
            }

            // Update local storage
            localStorage.setItem('offline_projects', JSON.stringify(offlineProjects));

            analyticsService.trackEvent('offline_projects_synced', {
                syncedCount: unsyncedProjects.filter(p => p.isSynced).length,
                failedCount: unsyncedProjects.filter(p => p.syncStatus === 'failed').length,
            });
        } catch (error) {
            console.error('Offline sync failed:', error);
        }
    }

    /**
     * Sync individual project
     */
    private async syncProject(project: OfflineProject): Promise<void> {
        const user = authService.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        const response = await fetch(`${this.apiBaseUrl}/performance/sync-project`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await authService.getToken()}`,
            },
            body: JSON.stringify({
                project,
                userId: user.uid,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to sync project');
        }
    }

    /**
     * Check if device supports 4K/8K
     */
    async checkDeviceCapabilities(): Promise<{
        supports4K: boolean;
        supports8K: boolean;
        maxResolution: string;
        recommendedSettings: any;
    }> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/performance/device-capabilities`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to check device capabilities');
            }

            const capabilities = await response.json();
            return capabilities;
        } catch (error) {
            console.error('Device capabilities check failed:', error);
            return this.generateMockDeviceCapabilities();
        }
    }

    /**
     * Generate mock device capabilities
     */
    private generateMockDeviceCapabilities() {
        const isHighEndDevice = navigator.hardwareConcurrency >= 8 &&
            navigator.deviceMemory >= 8;

        return {
            supports4K: isHighEndDevice,
            supports8K: isHighEndDevice && navigator.hardwareConcurrency >= 12,
            maxResolution: isHighEndDevice ? '8K' : '1080p',
            recommendedSettings: {
                resolution: isHighEndDevice ? '4K' : '1080p',
                quality: isHighEndDevice ? 'high' : 'medium',
                fps: isHighEndDevice ? 60 : 30,
                bitrate: isHighEndDevice ? 50000000 : 20000000, // 50Mbps vs 20Mbps
            },
        };
    }

    /**
     * Get performance metrics
     */
    async getPerformanceMetrics(projectId: string): Promise<PerformanceMetrics> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/performance/metrics/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get performance metrics');
            }

            const metrics = await response.json();

            analyticsService.trackEvent('performance_metrics_viewed', {
                userId: user.uid,
                projectId,
                renderTime: metrics.renderTime,
                fileSize: metrics.fileSize,
            });

            return metrics;
        } catch (error) {
            console.error('Performance metrics failed:', error);
            return this.generateMockPerformanceMetrics();
        }
    }

    /**
     * Generate mock performance metrics
     */
    private generateMockPerformanceMetrics(): PerformanceMetrics {
        return {
            renderTime: Math.random() * 300 + 60, // 60-360 seconds
            exportTime: Math.random() * 120 + 30, // 30-150 seconds
            fileSize: Math.random() * 100 * 1024 * 1024 + 10 * 1024 * 1024, // 10-110MB
            quality: Math.random() * 0.3 + 0.7, // 70-100%
            compressionRatio: Math.random() * 0.5 + 0.3, // 30-80%
            memoryUsage: Math.random() * 2048 + 512, // 512-2560MB
            cpuUsage: Math.random() * 80 + 20, // 20-100%
            networkUsage: Math.random() * 50 + 10, // 10-60MB
        };
    }

    /**
     * Optimize project for performance
     */
    async optimizeProject(projectId: string, targetQuality: 'low' | 'medium' | 'high' = 'medium'): Promise<{
        optimizedProjectId: string;
        improvements: string[];
        estimatedTime: number;
    }> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/performance/optimize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    projectId,
                    targetQuality,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to optimize project');
            }

            const result = await response.json();

            analyticsService.trackEvent('project_optimized', {
                userId: user.uid,
                projectId,
                targetQuality,
                estimatedTime: result.estimatedTime,
            });

            return result;
        } catch (error) {
            console.error('Project optimization failed:', error);
            throw error;
        }
    }

    /**
     * Check if online
     */
    isOnlineStatus(): boolean {
        return this.isOnline;
    }
}

export const performanceService = new PerformanceService(); 