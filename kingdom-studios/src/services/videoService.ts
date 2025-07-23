import { analyticsService } from './analyticsService';
import { storageService } from './storageService';
import { authService } from './authService';

export interface VideoProject {
    id: string;
    name: string;
    tracks: VideoTrack[];
    duration: number;
    aspectRatio: 'portrait' | 'square' | 'landscape';
    mode: 'faith' | 'encouragement';
    createdAt: Date;
    updatedAt: Date;
}

export interface VideoTrack {
    id: string;
    type: 'video' | 'audio' | 'text';
    source: string;
    startTime: number;
    duration: number;
    opacity: number;
    volume: number;
    effects: any[];
    position: { x: number; y: number };
    scale: number;
}

export interface RenderData {
    projectId: string;
    tracks: VideoTrack[];
    duration: number;
    aspectRatio: string;
    mode: string;
}

export interface ViralScore {
    score: number;
    category: 'viral' | 'trending' | 'average' | 'needs_work';
    breakdown: {
        hook: number;
        pacing: number;
        engagement: number;
        quality: number;
        relevance: number;
    };
    suggestions: string[];
    predictedViews: number;
    predictedEngagement: number;
}

export interface PublishData {
    projectId: string;
    platform: string;
    mode: string;
    viralScore: number | null;
}

class VideoService {
    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    }

    /**
     * Save video project to Firestore
     */
    async saveProject(project: VideoProject): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const projectData = {
                ...project,
                userId: user.uid,
                updatedAt: new Date(),
            };

            await fetch(`${this.apiBaseUrl}/video/projects/${project.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify(projectData),
            });

            analyticsService.trackEvent('video_project_saved', {
                userId: user.uid,
                projectId: project.id,
                trackCount: project.tracks.length,
                duration: project.duration,
            });
        } catch (error) {
            console.error('Failed to save project:', error);
            throw error;
        }
    }

    /**
     * Load video project from Firestore
     */
    async loadProject(projectId: string): Promise<VideoProject> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/video/projects/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to load project');
            }

            const project = await response.json();
            return project;
        } catch (error) {
            console.error('Failed to load project:', error);
            throw error;
        }
    }

    /**
     * List user's video projects
     */
    async listProjects(): Promise<VideoProject[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/video/projects`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to load projects');
            }

            const projects = await response.json();
            return projects;
        } catch (error) {
            console.error('Failed to list projects:', error);
            throw error;
        }
    }

    /**
     * Render video with all tracks and effects
     */
    async renderVideo(renderData: RenderData): Promise<{ videoUrl: string; metadata: any }> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            console.log('Starting video render:', renderData);

            // Upload tracks to storage
            const uploadedTracks = await Promise.all(
                renderData.tracks.map(async (track) => {
                    if (track.source.startsWith('file://') || track.source.startsWith('content://')) {
                        const uploadedUrl = await storageService.uploadVideo(track.source);
                        return { ...track, source: uploadedUrl };
                    }
                    return track;
                })
            );

            // Prepare render request
            const renderRequest = {
                ...renderData,
                tracks: uploadedTracks,
                userId: user.uid,
                timestamp: new Date().toISOString(),
            };

            // Start render job
            const response = await fetch(`${this.apiBaseUrl}/video/render`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify(renderRequest),
            });

            if (!response.ok) {
                throw new Error('Failed to start video render');
            }

            const renderJob = await response.json();
            console.log('Render job started:', renderJob);

            // Poll for completion
            const result = await this.pollRenderCompletion(renderJob.jobId);

            analyticsService.trackEvent('video_rendered', {
                userId: user.uid,
                projectId: renderData.projectId,
                duration: renderData.duration,
                trackCount: renderData.tracks.length,
                renderTime: result.renderTime,
            });

            return {
                videoUrl: result.videoUrl,
                metadata: result.metadata,
            };
        } catch (error) {
            console.error('Video render failed:', error);
            throw error;
        }
    }

    /**
     * Poll render job completion
     */
    private async pollRenderCompletion(jobId: string): Promise<any> {
        const maxAttempts = 60; // 5 minutes with 5-second intervals
        let attempts = 0;

        while (attempts < maxAttempts) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/video/render/${jobId}`, {
                    headers: {
                        'Authorization': `Bearer ${await authService.getToken()}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to check render status');
                }

                const status = await response.json();

                if (status.status === 'completed') {
                    return status.result;
                } else if (status.status === 'failed') {
                    throw new Error(`Render failed: ${status.error}`);
                }

                // Wait 5 seconds before next poll
                await new Promise(resolve => setTimeout(resolve, 5000));
                attempts++;
            } catch (error) {
                console.error('Poll error:', error);
                attempts++;
            }
        }

        throw new Error('Render timeout');
    }

    /**
     * Predict viral score using AI
     */
    async predictViralScore(videoUrl: string): Promise<number> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/video/predict-viral`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    videoUrl,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to predict viral score');
            }

            const result = await response.json();

            analyticsService.trackEvent('viral_score_predicted', {
                userId: user.uid,
                videoUrl,
                score: result.score,
            });

            return result.score;
        } catch (error) {
            console.error('Viral prediction failed:', error);
            // Return a default score if prediction fails
            return Math.floor(Math.random() * 40) + 30; // 30-70 range
        }
    }

    /**
     * Get detailed viral analysis
     */
    async getViralAnalysis(videoUrl: string): Promise<ViralScore> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/video/viral-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    videoUrl,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get viral analysis');
            }

            const analysis = await response.json();

            analyticsService.trackEvent('viral_analysis_generated', {
                userId: user.uid,
                videoUrl,
                score: analysis.score,
                category: analysis.category,
            });

            return analysis;
        } catch (error) {
            console.error('Viral analysis failed:', error);
            // Return mock analysis if API fails
            return this.generateMockViralAnalysis();
        }
    }

    /**
     * Generate mock viral analysis for fallback
     */
    private generateMockViralAnalysis(): ViralScore {
        const score = Math.floor(Math.random() * 40) + 30; // 30-70 range

        let category: ViralScore['category'];
        if (score >= 70) category = 'trending';
        else if (score >= 50) category = 'average';
        else category = 'needs_work';

        return {
            score,
            category,
            breakdown: {
                hook: Math.max(0, score + Math.floor(Math.random() * 20) - 10),
                pacing: Math.max(0, score + Math.floor(Math.random() * 20) - 10),
                engagement: Math.max(0, score + Math.floor(Math.random() * 20) - 10),
                quality: Math.max(0, score + Math.floor(Math.random() * 20) - 10),
                relevance: Math.max(0, score + Math.floor(Math.random() * 20) - 10),
            },
            suggestions: [
                'Start with a strong hook in the first 3 seconds',
                'Add trending music or sound effects',
                'Use relevant hashtags and captions',
                'Post at peak engagement times',
                'Engage with your community',
            ],
            predictedViews: Math.floor(Math.random() * 100000) + 10000,
            predictedEngagement: Math.floor(Math.random() * 15) + 5,
        };
    }

    /**
     * Publish video to social platforms
     */
    async publishToSocial(publishData: PublishData): Promise<{ success: boolean; url?: string }> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/video/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    ...publishData,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to publish video');
            }

            const result = await response.json();

            analyticsService.trackEvent('video_published', {
                userId: user.uid,
                projectId: publishData.projectId,
                platform: publishData.platform,
                viralScore: publishData.viralScore,
            });

            return {
                success: true,
                url: result.url,
            };
        } catch (error) {
            console.error('Publishing failed:', error);

            analyticsService.trackEvent('video_publish_failed', {
                userId: user?.uid,
                projectId: publishData.projectId,
                platform: publishData.platform,
                error: error.message,
            });

            return {
                success: false,
            };
        }
    }

    /**
     * Get publishing status for a platform
     */
    async getPublishingStatus(projectId: string, platform: string): Promise<any> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/video/publish/status/${projectId}/${platform}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get publishing status');
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to get publishing status:', error);
            throw error;
        }
    }

    /**
     * Get video analytics
     */
    async getVideoAnalytics(videoId: string): Promise<any> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/video/analytics/${videoId}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get video analytics');
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to get video analytics:', error);
            throw error;
        }
    }

    /**
     * Delete video project
     */
    async deleteProject(projectId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/video/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            analyticsService.trackEvent('video_project_deleted', {
                userId: user.uid,
                projectId,
            });
        } catch (error) {
            console.error('Failed to delete project:', error);
            throw error;
        }
    }

    /**
     * Export video in different formats
     */
    async exportVideo(projectId: string, format: 'mp4' | 'mov' | 'avi'): Promise<string> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/video/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    projectId,
                    format,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to export video');
            }

            const result = await response.json();

            analyticsService.trackEvent('video_exported', {
                userId: user.uid,
                projectId,
                format,
            });

            return result.downloadUrl;
        } catch (error) {
            console.error('Video export failed:', error);
            throw error;
        }
    }
}

export const videoService = new VideoService(); 