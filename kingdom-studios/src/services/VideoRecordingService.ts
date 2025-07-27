import { Environment } from '../config/environment';
import { AnalyticsTracking } from './analyticsService';
import { BackendAPI } from './apiService';

export interface RecordingSettings {
    quality: 'hd' | '4k';
    audioQuality: 'standard' | 'high' | 'studio';
    recordingType: 'podcast' | 'interview' | 'teaching' | 'testimony';
    faithMode: boolean;
    enableTranscription: boolean;
    enableAutoEdit: boolean;
}

export interface RecordingSession {
    sessionId: string;
    settings: RecordingSettings;
    faithMode: boolean;
}

export interface ProcessingRequest {
    sessionId: string;
    settings: RecordingSettings;
    faithMode: boolean;
    enableTranscription: boolean;
    enableAutoEdit: boolean;
}

export interface InviteLinkRequest {
    sessionId: string;
    recordingType: string;
    maxParticipants: number;
}

export interface RecordingResult {
    sessionId: string;
    recordingUrl: string;
    duration: number;
    participants: string[];
    transcription?: string;
    processedUrl?: string;
    metadata: {
        quality: string;
        audioQuality: string;
        recordingType: string;
        faithMode: boolean;
        processingTime: number;
    };
}

export class VideoRecordingService {
    private isInitialized: boolean = false;
    private currentRecording: any = null;

    constructor() {
        this.initialize();
    }

    private async initialize() {
        this.isInitialized = true;
        console.log('[Video Recording Service] Initialized');
    }

    /**
     * Start a new recording session
     */
    async startRecording(session: RecordingSession): Promise<void> {
        const startTime = Date.now();

        try {
            // Track recording start
            await AnalyticsTracking.trackUserAction('video_recording_started', {
                recording_type: session.settings.recordingType,
                quality: session.settings.quality,
                audio_quality: session.settings.audioQuality,
                faith_mode: session.faithMode,
            });

            // Try backend API first for advanced features
            if (Environment.get().API_BASE_URL) {
                try {
                    const backendResponse = await BackendAPI.startVideoRecording(session);

                    if (backendResponse.success) {
                        console.log('[Video Recording Service] Backend recording started');
                        return;
                    }
                } catch (backendError) {
                    if (Environment.isDebugEnabled()) {
                        console.warn('[Video Recording Service] Backend recording failed, using local recording:', backendError);
                    }
                }
            }

            // Fallback to local recording simulation
            await this.startLocalRecording(session);

        } catch (error) {
            await AnalyticsTracking.trackError(
                error instanceof Error ? error.message : 'Video recording start failed',
                {
                    recording_type: session.settings.recordingType,
                    faith_mode: session.faithMode,
                }
            );
            throw error;
        }
    }

    /**
     * Stop the current recording session
     */
    async stopRecording(sessionId: string): Promise<RecordingResult> {
        const startTime = Date.now();

        try {
            // Track recording stop
            await AnalyticsTracking.trackUserAction('video_recording_stopped', {
                session_id: sessionId,
            });

            // Try backend API first
            if (Environment.get().API_BASE_URL) {
                try {
                    const backendResponse = await BackendAPI.stopVideoRecording(sessionId);

                    if (backendResponse.success && backendResponse.data) {
                        const processingTime = Date.now() - startTime;

                        await AnalyticsTracking.trackVideoRecording(true, {
                            processing_time_ms: processingTime,
                            method: 'backend_api',
                        });

                        return {
                            sessionId,
                            recordingUrl: backendResponse.data.recordingUrl,
                            duration: backendResponse.data.duration,
                            participants: backendResponse.data.participants || [],
                            transcription: backendResponse.data.transcription,
                            processedUrl: backendResponse.data.processedUrl,
                            metadata: {
                                quality: backendResponse.data.metadata?.quality || 'hd',
                                audioQuality: backendResponse.data.metadata?.audioQuality || 'high',
                                recordingType: backendResponse.data.metadata?.recordingType || 'podcast',
                                faithMode: backendResponse.data.metadata?.faithMode || false,
                                processingTime,
                            },
                        };
                    }
                } catch (backendError) {
                    if (Environment.isDebugEnabled()) {
                        console.warn('[Video Recording Service] Backend stop failed, using local recording:', backendError);
                    }
                }
            }

            // Fallback to local recording simulation
            return await this.stopLocalRecording(sessionId);

        } catch (error) {
            const processingTime = Date.now() - startTime;

            await AnalyticsTracking.trackVideoRecording(false, {
                processing_time_ms: processingTime,
                error: error instanceof Error ? error.message : 'Unknown error',
            });

            await AnalyticsTracking.trackError(
                error instanceof Error ? error.message : 'Video recording stop failed',
                { session_id: sessionId }
            );

            throw error;
        }
    }

    /**
     * Process a completed recording
     */
    async processRecording(request: ProcessingRequest): Promise<void> {
        const startTime = Date.now();

        try {
            // Track processing start
            await AnalyticsTracking.trackUserAction('video_processing_started', {
                session_id: request.sessionId,
                enable_transcription: request.enableTranscription,
                enable_auto_edit: request.enableAutoEdit,
                faith_mode: request.faithMode,
            });

            // Try backend API first
            if (Environment.get().API_BASE_URL) {
                try {
                    const backendResponse = await BackendAPI.processVideoRecording(request);

                    if (backendResponse.success) {
                        const processingTime = Date.now() - startTime;

                        await AnalyticsTracking.trackVideoProcessing(true, {
                            processing_time_ms: processingTime,
                            method: 'backend_api',
                            enable_transcription: request.enableTranscription,
                            enable_auto_edit: request.enableAutoEdit,
                        });

                        return;
                    }
                } catch (backendError) {
                    if (Environment.isDebugEnabled()) {
                        console.warn('[Video Recording Service] Backend processing failed, using local processing:', backendError);
                    }
                }
            }

            // Fallback to local processing simulation
            await this.processLocalRecording(request);

        } catch (error) {
            const processingTime = Date.now() - startTime;

            await AnalyticsTracking.trackVideoProcessing(false, {
                processing_time_ms: processingTime,
                error: error instanceof Error ? error.message : 'Unknown error',
            });

            await AnalyticsTracking.trackError(
                error instanceof Error ? error.message : 'Video processing failed',
                { session_id: request.sessionId }
            );

            throw error;
        }
    }

    /**
     * Generate invite link for multi-guest recording
     */
    async generateInviteLink(request: InviteLinkRequest): Promise<string> {
        try {
            // Try backend API first
            if (Environment.get().API_BASE_URL) {
                try {
                    const backendResponse = await BackendAPI.generateRecordingInviteLink(request);

                    if (backendResponse.success && backendResponse.data?.inviteLink) {
                        return backendResponse.data.inviteLink;
                    }
                } catch (backendError) {
                    if (Environment.isDebugEnabled()) {
                        console.warn('[Video Recording Service] Backend invite link failed, using local generation:', backendError);
                    }
                }
            }

            // Fallback to local invite link generation
            return this.generateLocalInviteLink(request);

        } catch (error) {
            console.error('[Video Recording Service] Invite link generation error:', error);
            throw new Error('Failed to generate invite link');
        }
    }

    /**
     * Start local recording simulation
     */
    private async startLocalRecording(session: RecordingSession): Promise<void> {
        // Simulate recording start
        this.currentRecording = {
            sessionId: session.sessionId,
            startTime: Date.now(),
            settings: session.settings,
        };

        console.log('[Video Recording Service] Local recording started:', session.sessionId);
    }

    /**
     * Stop local recording simulation
     */
    private async stopLocalRecording(sessionId: string): Promise<RecordingResult> {
        if (!this.currentRecording || this.currentRecording.sessionId !== sessionId) {
            throw new Error('No active recording found');
        }

        const duration = Math.floor((Date.now() - this.currentRecording.startTime) / 1000);
        const settings = this.currentRecording.settings;

        // Simulate recording completion
        this.currentRecording = null;

        return {
            sessionId,
            recordingUrl: `https://kingdomstudios.app/recordings/${sessionId}.mp4`,
            duration,
            participants: ['You'],
            metadata: {
                quality: settings.quality,
                audioQuality: settings.audioQuality,
                recordingType: settings.recordingType,
                faithMode: settings.faithMode,
                processingTime: 0,
            },
        };
    }

    /**
     * Process local recording simulation
     */
    private async processLocalRecording(request: ProcessingRequest): Promise<void> {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

        console.log('[Video Recording Service] Local recording processed:', request.sessionId);
    }

    /**
     * Generate local invite link
     */
    private generateLocalInviteLink(request: InviteLinkRequest): string {
        const baseUrl = Environment.get().APP_URL || 'https://kingdomstudios.app';
        return `${baseUrl}/join-recording/${request.sessionId}?type=${request.recordingType}&max=${request.maxParticipants}`;
    }

    /**
     * Get recording session info
     */
    async getSessionInfo(sessionId: string): Promise<{
        sessionId: string;
        status: 'recording' | 'paused' | 'completed' | 'processing';
        duration: number;
        participants: string[];
        recordingType: string;
        faithMode: boolean;
    } | null> {
        try {
            // Try backend API first
            if (Environment.get().API_BASE_URL) {
                try {
                    const backendResponse = await BackendAPI.getRecordingSessionInfo(sessionId);

                    if (backendResponse.success && backendResponse.data) {
                        return backendResponse.data;
                    }
                } catch (backendError) {
                    if (Environment.isDebugEnabled()) {
                        console.warn('[Video Recording Service] Backend session info failed:', backendError);
                    }
                }
            }

            // Fallback to local session info
            if (this.currentRecording && this.currentRecording.sessionId === sessionId) {
                const duration = Math.floor((Date.now() - this.currentRecording.startTime) / 1000);
                return {
                    sessionId,
                    status: 'recording',
                    duration,
                    participants: ['You'],
                    recordingType: this.currentRecording.settings.recordingType,
                    faithMode: this.currentRecording.settings.faithMode,
                };
            }

            return null;

        } catch (error) {
            console.error('[Video Recording Service] Get session info error:', error);
            return null;
        }
    }

    /**
     * Check if service is available
     */
    isAvailable(): boolean {
        return this.isInitialized;
    }

    /**
     * Get service status
     */
    getStatus(): {
        initialized: boolean;
        backendAvailable: boolean;
        localRecordingAvailable: boolean;
    } {
        return {
            initialized: this.isInitialized,
            backendAvailable: !!Environment.get().API_BASE_URL,
            localRecordingAvailable: true,
        };
    }

    /**
     * Validate recording settings
     */
    validateSettings(settings: RecordingSettings): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (!settings.quality) {
            errors.push('Video quality is required');
        }

        if (!settings.audioQuality) {
            errors.push('Audio quality is required');
        }

        if (!settings.recordingType) {
            errors.push('Recording type is required');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }
} 