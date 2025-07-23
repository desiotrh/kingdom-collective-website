import { analyticsService } from './analyticsService';
import { authService } from './authService';

export interface CollaborationUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'owner' | 'editor' | 'viewer';
    online: boolean;
    lastActive: Date;
}

export interface CollaborationProject {
    id: string;
    name: string;
    ownerId: string;
    collaborators: CollaborationUser[];
    tracks: any[];
    version: number;
    createdAt: Date;
    updatedAt: Date;
    isLocked: boolean;
    lockedBy?: string;
}

export interface VersionHistory {
    id: string;
    version: number;
    userId: string;
    userName: string;
    timestamp: Date;
    changes: string[];
    tracks: any[];
    canRevert: boolean;
}

export interface TimelineComment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    timestamp: number;
    trackId?: string;
    content: string;
    replies: TimelineComment[];
    resolved: boolean;
    createdAt: Date;
}

export interface RemoteRecording {
    id: string;
    sessionId: string;
    participants: CollaborationUser[];
    recordingUrl: string;
    duration: number;
    tracks: any[];
    status: 'recording' | 'paused' | 'stopped';
    createdAt: Date;
}

class CollaborationService {
    private apiBaseUrl: string;
    private wsConnection: WebSocket | null = null;
    private projectId: string | null = null;
    private onUpdateCallback: ((data: any) => void) | null = null;

    constructor() {
        this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    }

    /**
     * Create a collaborative project
     */
    async createCollaborativeProject(
        name: string,
        tracks: any[],
        collaborators: string[] = []
    ): Promise<CollaborationProject> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    name,
                    tracks,
                    collaborators,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create collaborative project');
            }

            const project = await response.json();

            analyticsService.trackEvent('collaborative_project_created', {
                userId: user.uid,
                projectId: project.id,
                collaboratorCount: collaborators.length,
            });

            return project;
        } catch (error) {
            console.error('Failed to create collaborative project:', error);
            throw error;
        }
    }

    /**
     * Join a collaborative project
     */
    async joinProject(projectId: string): Promise<CollaborationProject> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/projects/${projectId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to join project');
            }

            const project = await response.json();

            // Connect to real-time updates
            this.connectToProject(projectId);

            analyticsService.trackEvent('project_joined', {
                userId: user.uid,
                projectId,
            });

            return project;
        } catch (error) {
            console.error('Failed to join project:', error);
            throw error;
        }
    }

    /**
     * Connect to real-time project updates
     */
    private connectToProject(projectId: string) {
        try {
            this.projectId = projectId;
            const wsUrl = `${this.apiBaseUrl.replace('http', 'ws')}/collaboration/ws/${projectId}`;

            this.wsConnection = new WebSocket(wsUrl);

            this.wsConnection.onopen = () => {
                console.log('Connected to collaboration websocket');
                this.sendMessage({
                    type: 'join',
                    userId: authService.getCurrentUser()?.uid,
                });
            };

            this.wsConnection.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleRealtimeUpdate(data);
            };

            this.wsConnection.onclose = () => {
                console.log('Disconnected from collaboration websocket');
                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    if (this.projectId) {
                        this.connectToProject(this.projectId);
                    }
                }, 5000);
            };

            this.wsConnection.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Failed to connect to project:', error);
        }
    }

    /**
     * Send message through WebSocket
     */
    private sendMessage(message: any) {
        if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
            this.wsConnection.send(JSON.stringify(message));
        }
    }

    /**
     * Handle real-time updates
     */
    private handleRealtimeUpdate(data: any) {
        if (this.onUpdateCallback) {
            this.onUpdateCallback(data);
        }

        switch (data.type) {
            case 'track_update':
                this.handleTrackUpdate(data);
                break;
            case 'user_joined':
                this.handleUserJoined(data);
                break;
            case 'user_left':
                this.handleUserLeft(data);
                break;
            case 'lock_changed':
                this.handleLockChanged(data);
                break;
            case 'comment_added':
                this.handleCommentAdded(data);
                break;
            default:
                console.log('Unknown update type:', data.type);
        }
    }

    /**
     * Handle track updates from other users
     */
    private handleTrackUpdate(data: any) {
        analyticsService.trackEvent('collaborative_track_updated', {
            userId: authService.getCurrentUser()?.uid,
            projectId: this.projectId,
            trackId: data.trackId,
            updatedBy: data.userId,
        });
    }

    /**
     * Handle user joining the project
     */
    private handleUserJoined(data: any) {
        console.log(`User ${data.userName} joined the project`);
    }

    /**
     * Handle user leaving the project
     */
    private handleUserLeft(data: any) {
        console.log(`User ${data.userName} left the project`);
    }

    /**
     * Handle lock changes
     */
    private handleLockChanged(data: any) {
        console.log(`Project lock changed: ${data.locked ? 'locked' : 'unlocked'} by ${data.userName}`);
    }

    /**
     * Handle new comments
     */
    private handleCommentAdded(data: any) {
        console.log(`New comment from ${data.userName}: ${data.content}`);
    }

    /**
     * Set update callback
     */
    setUpdateCallback(callback: (data: any) => void) {
        this.onUpdateCallback = callback;
    }

    /**
     * Update project tracks
     */
    async updateProjectTracks(projectId: string, tracks: any[]): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/projects/${projectId}/tracks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    tracks,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update project tracks');
            }

            // Send real-time update
            this.sendMessage({
                type: 'track_update',
                tracks,
                userId: user.uid,
            });

            analyticsService.trackEvent('collaborative_tracks_updated', {
                userId: user.uid,
                projectId,
                trackCount: tracks.length,
            });
        } catch (error) {
            console.error('Failed to update project tracks:', error);
            throw error;
        }
    }

    /**
     * Lock/unlock project
     */
    async toggleProjectLock(projectId: string, locked: boolean): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/projects/${projectId}/lock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    locked,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to toggle project lock');
            }

            // Send real-time update
            this.sendMessage({
                type: 'lock_changed',
                locked,
                userId: user.uid,
            });

            analyticsService.trackEvent('project_lock_toggled', {
                userId: user.uid,
                projectId,
                locked,
            });
        } catch (error) {
            console.error('Failed to toggle project lock:', error);
            throw error;
        }
    }

    /**
     * Get version history
     */
    async getVersionHistory(projectId: string): Promise<VersionHistory[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/projects/${projectId}/versions`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get version history');
            }

            const versions = await response.json();
            return versions;
        } catch (error) {
            console.error('Failed to get version history:', error);
            throw error;
        }
    }

    /**
     * Revert to previous version
     */
    async revertToVersion(projectId: string, versionId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/projects/${projectId}/revert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    versionId,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to revert to version');
            }

            analyticsService.trackEvent('project_version_reverted', {
                userId: user.uid,
                projectId,
                versionId,
            });
        } catch (error) {
            console.error('Failed to revert to version:', error);
            throw error;
        }
    }

    /**
     * Add timeline comment
     */
    async addTimelineComment(
        projectId: string,
        content: string,
        timestamp: number,
        trackId?: string
    ): Promise<TimelineComment> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/projects/${projectId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    content,
                    timestamp,
                    trackId,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            const comment = await response.json();

            // Send real-time update
            this.sendMessage({
                type: 'comment_added',
                comment,
                userId: user.uid,
            });

            analyticsService.trackEvent('timeline_comment_added', {
                userId: user.uid,
                projectId,
                timestamp,
                trackId,
            });

            return comment;
        } catch (error) {
            console.error('Failed to add comment:', error);
            throw error;
        }
    }

    /**
     * Get timeline comments
     */
    async getTimelineComments(projectId: string): Promise<TimelineComment[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/projects/${projectId}/comments`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get comments');
            }

            const comments = await response.json();
            return comments;
        } catch (error) {
            console.error('Failed to get comments:', error);
            throw error;
        }
    }

    /**
     * Resolve timeline comment
     */
    async resolveComment(projectId: string, commentId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/projects/${projectId}/comments/${commentId}/resolve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to resolve comment');
            }

            analyticsService.trackEvent('timeline_comment_resolved', {
                userId: user.uid,
                projectId,
                commentId,
            });
        } catch (error) {
            console.error('Failed to resolve comment:', error);
            throw error;
        }
    }

    /**
     * Start remote recording session
     */
    async startRemoteRecording(projectId: string, participants: string[]): Promise<RemoteRecording> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/remote-recording`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    projectId,
                    participants,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to start remote recording');
            }

            const recording = await response.json();

            analyticsService.trackEvent('remote_recording_started', {
                userId: user.uid,
                projectId,
                participantCount: participants.length,
            });

            return recording;
        } catch (error) {
            console.error('Failed to start remote recording:', error);
            throw error;
        }
    }

    /**
     * Join remote recording session
     */
    async joinRemoteRecording(sessionId: string): Promise<RemoteRecording> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/remote-recording/${sessionId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to join remote recording');
            }

            const recording = await response.json();

            analyticsService.trackEvent('remote_recording_joined', {
                userId: user.uid,
                sessionId,
            });

            return recording;
        } catch (error) {
            console.error('Failed to join remote recording:', error);
            throw error;
        }
    }

    /**
     * Stop remote recording
     */
    async stopRemoteRecording(sessionId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/remote-recording/${sessionId}/stop`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to stop remote recording');
            }

            analyticsService.trackEvent('remote_recording_stopped', {
                userId: user.uid,
                sessionId,
            });
        } catch (error) {
            console.error('Failed to stop remote recording:', error);
            throw error;
        }
    }

    /**
     * Share project template
     */
    async shareProjectTemplate(projectId: string, templateName: string, isPublic: boolean = false): Promise<string> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/collaboration/projects/${projectId}/share-template`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    templateName,
                    isPublic,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to share project template');
            }

            const result = await response.json();

            analyticsService.trackEvent('project_template_shared', {
                userId: user.uid,
                projectId,
                templateName,
                isPublic,
            });

            return result.shareUrl;
        } catch (error) {
            console.error('Failed to share project template:', error);
            throw error;
        }
    }

    /**
     * Disconnect from project
     */
    disconnect() {
        if (this.wsConnection) {
            this.wsConnection.close();
            this.wsConnection = null;
        }
        this.projectId = null;
        this.onUpdateCallback = null;
    }
}

export const collaborationService = new CollaborationService(); 