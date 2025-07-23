import { analyticsService } from './analyticsService';
import { authService } from './authService';

export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    component: string;
    position: { x: number; y: number };
    isCompleted: boolean;
    isRequired: boolean;
    nextStepId?: string;
    previousStepId?: string;
}

export interface OnboardingFlow {
    id: string;
    name: string;
    description: string;
    steps: OnboardingStep[];
    isCompleted: boolean;
    progress: number;
    createdAt: Date;
    completedAt?: Date;
}

export interface CustomShortcut {
    id: string;
    name: string;
    description: string;
    action: string;
    keyCombination: string;
    gesture?: string;
    isEnabled: boolean;
    category: 'editing' | 'navigation' | 'effects' | 'export' | 'custom';
    icon?: string;
}

export interface WorkspaceLayout {
    id: string;
    name: string;
    description: string;
    layout: {
        timeline: { x: number; y: number; width: number; height: number };
        preview: { x: number; y: number; width: number; height: number };
        effects: { x: number; y: number; width: number; height: number };
        audio: { x: number; y: number; width: number; height: number };
        properties: { x: number; y: number; width: number; height: number };
    };
    isDefault: boolean;
    isCustom: boolean;
    createdAt: Date;
}

export interface QuickAction {
    id: string;
    name: string;
    description: string;
    icon: string;
    action: string;
    parameters: any;
    category: 'trim' | 'caption' | 'effect' | 'transition' | 'audio' | 'export';
    isEnabled: boolean;
    shortcut?: string;
}

export interface EditHistoryEntry {
    id: string;
    action: string;
    description: string;
    timestamp: Date;
    userId: string;
    projectId: string;
    data: any;
    canUndo: boolean;
    canRedo: boolean;
    undoData?: any;
    redoData?: any;
}

export interface EditHistory {
    projectId: string;
    entries: EditHistoryEntry[];
    currentIndex: number;
    maxEntries: number;
}

class UXService {
    private apiBaseUrl: string;
    private currentOnboardingFlow: OnboardingFlow | null = null;
    private editHistory: Map<string, EditHistory> = new Map();

    constructor() {
        this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    }

    /**
     * Start onboarding flow
     */
    async startOnboarding(flowName: string): Promise<OnboardingFlow> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ux/onboarding/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    flowName,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to start onboarding');
            }

            const flow = await response.json();
            this.currentOnboardingFlow = flow;

            analyticsService.trackEvent('onboarding_started', {
                userId: user.uid,
                flowName,
            });

            return flow;
        } catch (error) {
            console.error('Onboarding start failed:', error);
            return this.generateMockOnboardingFlow(flowName);
        }
    }

    /**
     * Generate mock onboarding flow
     */
    private generateMockOnboardingFlow(flowName: string): OnboardingFlow {
        const steps: OnboardingStep[] = [
            {
                id: 'welcome',
                title: 'Welcome to Kingdom Clips',
                description: 'Let\'s get you started with creating amazing faith-based content',
                component: 'WelcomeStep',
                position: { x: 50, y: 50 },
                isCompleted: false,
                isRequired: true,
                nextStepId: 'interface',
            },
            {
                id: 'interface',
                title: 'Interface Overview',
                description: 'Learn about the main editing interface and tools',
                component: 'InterfaceStep',
                position: { x: 200, y: 100 },
                isCompleted: false,
                isRequired: true,
                nextStepId: 'timeline',
                previousStepId: 'welcome',
            },
            {
                id: 'timeline',
                title: 'Timeline Editor',
                description: 'Master the timeline for precise video editing',
                component: 'TimelineStep',
                position: { x: 150, y: 300 },
                isCompleted: false,
                isRequired: true,
                nextStepId: 'effects',
                previousStepId: 'interface',
            },
            {
                id: 'effects',
                title: 'Effects & Transitions',
                description: 'Add stunning effects and smooth transitions',
                component: 'EffectsStep',
                position: { x: 400, y: 200 },
                isCompleted: false,
                isRequired: false,
                nextStepId: 'export',
                previousStepId: 'timeline',
            },
            {
                id: 'export',
                title: 'Export & Share',
                description: 'Export your masterpiece and share with the world',
                component: 'ExportStep',
                position: { x: 300, y: 400 },
                isCompleted: false,
                isRequired: true,
                previousStepId: 'effects',
            },
        ];

        return {
            id: `flow_${Date.now()}`,
            name: flowName,
            description: 'Complete guide to Kingdom Clips features',
            steps,
            isCompleted: false,
            progress: 0,
            createdAt: new Date(),
        };
    }

    /**
     * Complete onboarding step
     */
    async completeOnboardingStep(stepId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            if (!this.currentOnboardingFlow) {
                throw new Error('No active onboarding flow');
            }

            const step = this.currentOnboardingFlow.steps.find(s => s.id === stepId);
            if (step) {
                step.isCompleted = true;
                this.updateOnboardingProgress();
            }

            const response = await fetch(`${this.apiBaseUrl}/ux/onboarding/complete-step`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    flowId: this.currentOnboardingFlow.id,
                    stepId,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to complete onboarding step');
            }

            analyticsService.trackEvent('onboarding_step_completed', {
                userId: user.uid,
                stepId,
                flowId: this.currentOnboardingFlow.id,
            });
        } catch (error) {
            console.error('Onboarding step completion failed:', error);
        }
    }

    /**
     * Update onboarding progress
     */
    private updateOnboardingProgress(): void {
        if (!this.currentOnboardingFlow) return;

        const completedSteps = this.currentOnboardingFlow.steps.filter(s => s.isCompleted).length;
        const totalSteps = this.currentOnboardingFlow.steps.length;
        this.currentOnboardingFlow.progress = (completedSteps / totalSteps) * 100;
        this.currentOnboardingFlow.isCompleted = completedSteps === totalSteps;

        if (this.currentOnboardingFlow.isCompleted) {
            this.currentOnboardingFlow.completedAt = new Date();
        }
    }

    /**
     * Get current onboarding flow
     */
    getCurrentOnboardingFlow(): OnboardingFlow | null {
        return this.currentOnboardingFlow;
    }

    /**
     * Get custom shortcuts
     */
    async getCustomShortcuts(): Promise<CustomShortcut[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ux/shortcuts`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get custom shortcuts');
            }

            const shortcuts = await response.json();

            analyticsService.trackEvent('custom_shortcuts_viewed', {
                userId: user.uid,
                shortcutCount: shortcuts.length,
            });

            return shortcuts;
        } catch (error) {
            console.error('Custom shortcuts failed:', error);
            return this.generateMockCustomShortcuts();
        }
    }

    /**
     * Generate mock custom shortcuts
     */
    private generateMockCustomShortcuts(): CustomShortcut[] {
        return [
            {
                id: 'shortcut_1',
                name: 'Quick Trim',
                description: 'Trim selected clip to 15 seconds',
                action: 'trim_clip',
                keyCombination: 'Ctrl+T',
                isEnabled: true,
                category: 'editing',
                icon: 'scissors',
            },
            {
                id: 'shortcut_2',
                name: 'Add Caption',
                description: 'Add auto-generated caption to selected clip',
                action: 'add_caption',
                keyCombination: 'Ctrl+C',
                isEnabled: true,
                category: 'editing',
                icon: 'text',
            },
            {
                id: 'shortcut_3',
                name: 'Apply Fade',
                description: 'Apply fade transition to selected clips',
                action: 'apply_fade',
                keyCombination: 'Ctrl+F',
                isEnabled: true,
                category: 'effects',
                icon: 'fade',
            },
            {
                id: 'shortcut_4',
                name: 'Export HD',
                description: 'Quick export in HD quality',
                action: 'export_hd',
                keyCombination: 'Ctrl+E',
                isEnabled: true,
                category: 'export',
                icon: 'export',
            },
            {
                id: 'shortcut_5',
                name: 'Undo Last',
                description: 'Undo last action',
                action: 'undo',
                keyCombination: 'Ctrl+Z',
                isEnabled: true,
                category: 'editing',
                icon: 'undo',
            },
        ];
    }

    /**
     * Create custom shortcut
     */
    async createCustomShortcut(shortcut: Omit<CustomShortcut, 'id'>): Promise<CustomShortcut> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ux/shortcuts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    ...shortcut,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create custom shortcut');
            }

            const createdShortcut = await response.json();

            analyticsService.trackEvent('custom_shortcut_created', {
                userId: user.uid,
                name: shortcut.name,
                action: shortcut.action,
                category: shortcut.category,
            });

            return createdShortcut;
        } catch (error) {
            console.error('Custom shortcut creation failed:', error);
            throw error;
        }
    }

    /**
     * Update custom shortcut
     */
    async updateCustomShortcut(shortcutId: string, updates: Partial<CustomShortcut>): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ux/shortcuts/${shortcutId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    ...updates,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update custom shortcut');
            }

            analyticsService.trackEvent('custom_shortcut_updated', {
                userId: user.uid,
                shortcutId,
                updates: Object.keys(updates),
            });
        } catch (error) {
            console.error('Custom shortcut update failed:', error);
            throw error;
        }
    }

    /**
     * Get workspace layouts
     */
    async getWorkspaceLayouts(): Promise<WorkspaceLayout[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ux/workspace-layouts`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get workspace layouts');
            }

            const layouts = await response.json();

            analyticsService.trackEvent('workspace_layouts_viewed', {
                userId: user.uid,
                layoutCount: layouts.length,
            });

            return layouts;
        } catch (error) {
            console.error('Workspace layouts failed:', error);
            return this.generateMockWorkspaceLayouts();
        }
    }

    /**
     * Generate mock workspace layouts
     */
    private generateMockWorkspaceLayouts(): WorkspaceLayout[] {
        return [
            {
                id: 'layout_1',
                name: 'Default Layout',
                description: 'Standard editing workspace layout',
                layout: {
                    timeline: { x: 0, y: 70, width: 100, height: 30 },
                    preview: { x: 0, y: 0, width: 70, height: 70 },
                    effects: { x: 70, y: 0, width: 30, height: 35 },
                    audio: { x: 70, y: 35, width: 30, height: 35 },
                    properties: { x: 0, y: 100, width: 100, height: 0 },
                },
                isDefault: true,
                isCustom: false,
                createdAt: new Date(),
            },
            {
                id: 'layout_2',
                name: 'Focus on Timeline',
                description: 'Expanded timeline for detailed editing',
                layout: {
                    timeline: { x: 0, y: 60, width: 100, height: 40 },
                    preview: { x: 0, y: 0, width: 60, height: 60 },
                    effects: { x: 60, y: 0, width: 40, height: 30 },
                    audio: { x: 60, y: 30, width: 40, height: 30 },
                    properties: { x: 0, y: 100, width: 100, height: 0 },
                },
                isDefault: false,
                isCustom: true,
                createdAt: new Date(),
            },
            {
                id: 'layout_3',
                name: 'Large Preview',
                description: 'Maximized preview for detailed review',
                layout: {
                    timeline: { x: 0, y: 80, width: 100, height: 20 },
                    preview: { x: 0, y: 0, width: 80, height: 80 },
                    effects: { x: 80, y: 0, width: 20, height: 40 },
                    audio: { x: 80, y: 40, width: 20, height: 40 },
                    properties: { x: 0, y: 100, width: 100, height: 0 },
                },
                isDefault: false,
                isCustom: true,
                createdAt: new Date(),
            },
        ];
    }

    /**
     * Save workspace layout
     */
    async saveWorkspaceLayout(layout: Omit<WorkspaceLayout, 'id' | 'createdAt'>): Promise<WorkspaceLayout> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ux/workspace-layouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    ...layout,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save workspace layout');
            }

            const savedLayout = await response.json();

            analyticsService.trackEvent('workspace_layout_saved', {
                userId: user.uid,
                name: layout.name,
                isCustom: layout.isCustom,
            });

            return savedLayout;
        } catch (error) {
            console.error('Workspace layout save failed:', error);
            throw error;
        }
    }

    /**
     * Get quick actions
     */
    async getQuickActions(): Promise<QuickAction[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ux/quick-actions`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get quick actions');
            }

            const actions = await response.json();

            analyticsService.trackEvent('quick_actions_viewed', {
                userId: user.uid,
                actionCount: actions.length,
            });

            return actions;
        } catch (error) {
            console.error('Quick actions failed:', error);
            return this.generateMockQuickActions();
        }
    }

    /**
     * Generate mock quick actions
     */
    private generateMockQuickActions(): QuickAction[] {
        return [
            {
                id: 'action_1',
                name: 'Auto Trim',
                description: 'Automatically trim clips to optimal length',
                icon: 'scissors',
                action: 'auto_trim',
                parameters: { targetLength: 15 },
                category: 'trim',
                isEnabled: true,
                shortcut: 'Ctrl+Shift+T',
            },
            {
                id: 'action_2',
                name: 'Smart Caption',
                description: 'Generate and add captions automatically',
                icon: 'text',
                action: 'smart_caption',
                parameters: { language: 'en', style: 'modern' },
                category: 'caption',
                isEnabled: true,
                shortcut: 'Ctrl+Shift+C',
            },
            {
                id: 'action_3',
                name: 'Faith Overlay',
                description: 'Add faith-themed text overlay',
                icon: 'cross',
                action: 'faith_overlay',
                parameters: { text: 'God is Good', style: 'elegant' },
                category: 'effect',
                isEnabled: true,
                shortcut: 'Ctrl+Shift+F',
            },
            {
                id: 'action_4',
                name: 'Smooth Transition',
                description: 'Apply smooth transition between clips',
                icon: 'transition',
                action: 'smooth_transition',
                parameters: { type: 'fade', duration: 1.5 },
                category: 'transition',
                isEnabled: true,
                shortcut: 'Ctrl+Shift+S',
            },
            {
                id: 'action_5',
                name: 'Audio Sync',
                description: 'Sync audio with video automatically',
                icon: 'audio',
                action: 'audio_sync',
                parameters: { tolerance: 0.1 },
                category: 'audio',
                isEnabled: true,
                shortcut: 'Ctrl+Shift+A',
            },
            {
                id: 'action_6',
                name: 'Quick Export',
                description: 'Export optimized for social media',
                icon: 'export',
                action: 'quick_export',
                parameters: { platform: 'auto', quality: 'high' },
                category: 'export',
                isEnabled: true,
                shortcut: 'Ctrl+Shift+E',
            },
        ];
    }

    /**
     * Execute quick action
     */
    async executeQuickAction(actionId: string, parameters?: any): Promise<any> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ux/quick-actions/${actionId}/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    parameters,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to execute quick action');
            }

            const result = await response.json();

            analyticsService.trackEvent('quick_action_executed', {
                userId: user.uid,
                actionId,
                parameters,
            });

            return result;
        } catch (error) {
            console.error('Quick action execution failed:', error);
            throw error;
        }
    }

    /**
     * Add edit history entry
     */
    addEditHistoryEntry(projectId: string, entry: Omit<EditHistoryEntry, 'id' | 'timestamp'>): void {
        const history = this.editHistory.get(projectId) || {
            projectId,
            entries: [],
            currentIndex: -1,
            maxEntries: 100,
        };

        const newEntry: EditHistoryEntry = {
            ...entry,
            id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
        };

        // Remove any entries after current index (for redo)
        history.entries = history.entries.slice(0, history.currentIndex + 1);

        // Add new entry
        history.entries.push(newEntry);
        history.currentIndex = history.entries.length - 1;

        // Limit history size
        if (history.entries.length > history.maxEntries) {
            history.entries = history.entries.slice(-history.maxEntries);
            history.currentIndex = history.entries.length - 1;
        }

        this.editHistory.set(projectId, history);

        analyticsService.trackEvent('edit_history_entry_added', {
            userId: entry.userId,
            projectId,
            action: entry.action,
        });
    }

    /**
     * Get edit history
     */
    getEditHistory(projectId: string): EditHistory | null {
        return this.editHistory.get(projectId) || null;
    }

    /**
     * Undo last action
     */
    undo(projectId: string): EditHistoryEntry | null {
        const history = this.editHistory.get(projectId);
        if (!history || history.currentIndex <= 0) return null;

        history.currentIndex--;
        const entry = history.entries[history.currentIndex];

        analyticsService.trackEvent('edit_history_undo', {
            userId: entry.userId,
            projectId,
            action: entry.action,
        });

        return entry;
    }

    /**
     * Redo last undone action
     */
    redo(projectId: string): EditHistoryEntry | null {
        const history = this.editHistory.get(projectId);
        if (!history || history.currentIndex >= history.entries.length - 1) return null;

        history.currentIndex++;
        const entry = history.entries[history.currentIndex];

        analyticsService.trackEvent('edit_history_redo', {
            userId: entry.userId,
            projectId,
            action: entry.action,
        });

        return entry;
    }

    /**
     * Clear edit history
     */
    clearEditHistory(projectId: string): void {
        this.editHistory.delete(projectId);

        analyticsService.trackEvent('edit_history_cleared', {
            projectId,
        });
    }
}

export const uxService = new UXService(); 