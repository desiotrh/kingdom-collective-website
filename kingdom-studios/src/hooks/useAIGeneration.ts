import { useState } from 'react';
import { aiService, type AIContentType, type AIGenerationOptions } from '../services/aiService';
import { useAuth } from '../contexts/FirebaseAuthContext';

/**
 * 🤖 AI GENERATION HOOK
 * React hook for easy AI content generation with tier checking
 */

export interface UseAIGenerationResult {
  generateContent: (
    contentType: AIContentType,
    prompt: string,
    options?: AIGenerationOptions
  ) => Promise<void>;
  content: string;
  isGenerating: boolean;
  error: string | null;
  stats: {
    thisMonth: number;
    remainingGenerations: number;
    tier: string;
  } | null;
  refreshStats: () => Promise<void>;
}

export const useAIGeneration = (): UseAIGenerationResult => {
  const { user } = useAuth();
  const [content, setContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    thisMonth: number;
    remainingGenerations: number;
    tier: string;
  } | null>(null);

  const generateContent = async (
    contentType: AIContentType,
    prompt: string,
    options: AIGenerationOptions = {}
  ): Promise<void> => {
    if (!user) {
      setError('Please log in to generate content');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await aiService.generateContent(
        user.uid,
        contentType,
        prompt,
        options
      );

      if (result.success) {
        setContent(result.content);
        // Refresh stats after successful generation
        await refreshStats();
      } else {
        setError(result.error || 'Content generation failed');
        setContent('');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setContent('');
    } finally {
      setIsGenerating(false);
    }
  };

  const refreshStats = async (): Promise<void> => {
    if (!user) return;

    try {
      const newStats = await aiService.getGenerationStats(user.uid);
      setStats(newStats);
    } catch (err) {
      console.error('Error refreshing AI stats:', err);
    }
  };

  return {
    generateContent,
    content,
    isGenerating,
    error,
    stats,
    refreshStats
  };
};

/**
 * 🎯 SPECIALIZED AI HOOKS FOR SPECIFIC CONTENT TYPES
 */

export const useSocialPostGenerator = () => {
  const aiHook = useAIGeneration();
  
  const generateSocialPost = (
    prompt: string, 
    platform?: string, 
    faithMode?: boolean,
    tone?: 'professional' | 'casual' | 'inspirational'
  ) => {
    return aiHook.generateContent('social_post', prompt, {
      platform,
      faithMode,
      tone
    });
  };

  return {
    ...aiHook,
    generateSocialPost
  };
};

export const useHashtagGenerator = () => {
  const aiHook = useAIGeneration();
  
  const generateHashtags = (
    prompt: string,
    faithMode?: boolean
  ) => {
    return aiHook.generateContent('hashtags', prompt, {
      faithMode,
      maxTokens: 200
    });
  };

  return {
    ...aiHook,
    generateHashtags
  };
};

export const useProductDescriptionGenerator = () => {
  const aiHook = useAIGeneration();
  
  const generateProductDescription = (
    prompt: string,
    faithMode?: boolean,
    tone?: 'professional' | 'casual' | 'inspirational'
  ) => {
    return aiHook.generateContent('product_description', prompt, {
      faithMode,
      tone,
      maxTokens: 300
    });
  };

  return {
    ...aiHook,
    generateProductDescription
  };
};

export const useEmailContentGenerator = () => {
  const aiHook = useAIGeneration();
  
  const generateEmailContent = (
    prompt: string,
    faithMode?: boolean,
    tone?: 'professional' | 'casual' | 'inspirational'
  ) => {
    return aiHook.generateContent('email_content', prompt, {
      faithMode,
      tone,
      maxTokens: 600
    });
  };

  return {
    ...aiHook,
    generateEmailContent
  };
};
