/**
 * React Hook for Social Media Integration
 * Provides easy access to social media posting and management functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { SocialMediaService, SocialMediaPlatform, PostContent, PostResult, ScheduledPost } from '../services/socialMediaService';

interface UseSocialMediaReturn {
  // Platform Management
  supportedPlatforms: SocialMediaPlatform[];
  connectedPlatforms: SocialMediaPlatform[];
  connectPlatform: (platformId: string, authData: any) => Promise<boolean>;
  disconnectPlatform: (platformId: string) => Promise<boolean>;
  
  // Content Posting
  postToMultiplePlatforms: (content: PostContent, platformIds: string[]) => Promise<PostResult[]>;
  
  // Scheduled Posts
  schedulePost: (content: PostContent, platforms: string[], scheduledTime: Date) => Promise<string>;
  scheduledPosts: ScheduledPost[];
  cancelScheduledPost: (postId: string) => Promise<boolean>;
  
  // Loading States
  isPosting: boolean;
  isConnecting: boolean;
  isLoading: boolean;
  
  // Error State
  error: string | null;
  
  // Utility
  refreshData: () => void;
}

export const useSocialMedia = (): UseSocialMediaReturn => {
  const [socialMediaService] = useState(() => SocialMediaService.getInstance());
  
  // Platform State
  const [supportedPlatforms, setSupportedPlatforms] = useState<SocialMediaPlatform[]>([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState<SocialMediaPlatform[]>([]);
  
  // Scheduled Posts State
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  
  // Loading States
  const [isPosting, setIsPosting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Error State
  const [error, setError] = useState<string | null>(null);

  // Initialize data
  const loadData = useCallback(() => {
    try {
      setSupportedPlatforms(socialMediaService.getSupportedPlatforms());
      setConnectedPlatforms(socialMediaService.getConnectedPlatforms());
      setScheduledPosts(socialMediaService.getScheduledPosts());
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load social media data');
      setIsLoading(false);
    }
  }, [socialMediaService]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Platform Connection Management
  const connectPlatform = useCallback(async (platformId: string, authData: any): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const success = await socialMediaService.connectPlatform(platformId, authData);
      if (success) {
        // Refresh platform data
        setSupportedPlatforms(socialMediaService.getSupportedPlatforms());
        setConnectedPlatforms(socialMediaService.getConnectedPlatforms());
      } else {
        setError('Failed to connect platform');
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect platform');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [socialMediaService]);

  const disconnectPlatform = useCallback(async (platformId: string): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const success = await socialMediaService.disconnectPlatform(platformId);
      if (success) {
        // Refresh platform data
        setSupportedPlatforms(socialMediaService.getSupportedPlatforms());
        setConnectedPlatforms(socialMediaService.getConnectedPlatforms());
      } else {
        setError('Failed to disconnect platform');
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect platform');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [socialMediaService]);

  // Content Posting
  const postToMultiplePlatforms = useCallback(async (
    content: PostContent, 
    platformIds: string[]
  ): Promise<PostResult[]> => {
    setIsPosting(true);
    setError(null);
    
    try {
      const results = await socialMediaService.postToMultiplePlatforms(content, platformIds);
      
      // Check if any posts failed
      const failedPosts = results.filter(result => !result.success);
      if (failedPosts.length > 0) {
        const failedPlatforms = failedPosts.map(post => post.platform).join(', ');
        setError(`Failed to post to: ${failedPlatforms}`);
      }
      
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to post content';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsPosting(false);
    }
  }, [socialMediaService]);

  // Scheduled Posts Management
  const schedulePost = useCallback(async (
    content: PostContent,
    platforms: string[],
    scheduledTime: Date
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const postId = await socialMediaService.schedulePost(content, platforms, scheduledTime);
      
      // Refresh scheduled posts
      setScheduledPosts(socialMediaService.getScheduledPosts());
      
      return postId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule post';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [socialMediaService]);

  const cancelScheduledPost = useCallback(async (postId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await socialMediaService.cancelScheduledPost(postId);
      
      if (success) {
        // Refresh scheduled posts
        setScheduledPosts(socialMediaService.getScheduledPosts());
      } else {
        setError('Failed to cancel scheduled post');
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel scheduled post';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [socialMediaService]);

  // Utility function to refresh all data
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    // Platform Management
    supportedPlatforms,
    connectedPlatforms,
    connectPlatform,
    disconnectPlatform,
    
    // Content Posting
    postToMultiplePlatforms,
    
    // Scheduled Posts
    schedulePost,
    scheduledPosts,
    cancelScheduledPost,
    
    // Loading States
    isPosting,
    isConnecting,
    isLoading,
    
    // Error State
    error,
    
    // Utility
    refreshData
  };
};

export default useSocialMedia;
