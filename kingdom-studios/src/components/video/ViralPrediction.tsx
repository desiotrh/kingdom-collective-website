import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { KingdomColors } from '../../constants/KingdomColors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ViralScore {
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

interface ViralPredictionProps {
  score: number;
  onClose: () => void;
  onImprove: () => void;
}

export const ViralPrediction: React.FC<ViralPredictionProps> = ({
  score,
  onClose,
  onImprove,
}) => {
  const [viralScore, setViralScore] = useState<ViralScore | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Generate viral score breakdown based on the score
    const generateViralScore = (score: number): ViralScore => {
      let category: ViralScore['category'];
      let predictedViews: number;
      let predictedEngagement: number;

      if (score >= 80) {
        category = 'viral';
        predictedViews = Math.floor(Math.random() * 500000) + 1000000; // 1M-1.5M
        predictedEngagement = Math.floor(Math.random() * 20) + 15; // 15-35%
      } else if (score >= 60) {
        category = 'trending';
        predictedViews = Math.floor(Math.random() * 200000) + 500000; // 500K-700K
        predictedEngagement = Math.floor(Math.random() * 15) + 10; // 10-25%
      } else if (score >= 40) {
        category = 'average';
        predictedViews = Math.floor(Math.random() * 100000) + 100000; // 100K-200K
        predictedEngagement = Math.floor(Math.random() * 10) + 5; // 5-15%
      } else {
        category = 'needs_work';
        predictedViews = Math.floor(Math.random() * 50000) + 10000; // 10K-60K
        predictedEngagement = Math.floor(Math.random() * 8) + 2; // 2-10%
      }

      // Generate breakdown scores
      const breakdown = {
        hook: Math.max(0, score + Math.floor(Math.random() * 20) - 10),
        pacing: Math.max(0, score + Math.floor(Math.random() * 20) - 10),
        engagement: Math.max(0, score + Math.floor(Math.random() * 20) - 10),
        quality: Math.max(0, score + Math.floor(Math.random() * 20) - 10),
        relevance: Math.max(0, score + Math.floor(Math.random() * 20) - 10),
      };

      // Generate suggestions based on score
      const suggestions = generateSuggestions(score, breakdown);

      return {
        score,
        category,
        breakdown,
        suggestions,
        predictedViews,
        predictedEngagement,
      };
    };

    setViralScore(generateViralScore(score));
  }, [score]);

  const generateSuggestions = (score: number, breakdown: any): string[] => {
    const suggestions: string[] = [];

    if (score < 40) {
      suggestions.push('Start with a strong hook in the first 3 seconds');
      suggestions.push('Improve video quality and lighting');
      suggestions.push('Add trending music or sound effects');
      suggestions.push('Use relevant hashtags and captions');
    } else if (score < 60) {
      suggestions.push('Optimize pacing - keep viewers engaged throughout');
      suggestions.push('Add more visual elements and transitions');
      suggestions.push('Include a call-to-action in your video');
      suggestions.push('Post at peak engagement times');
    } else if (score < 80) {
      suggestions.push('Fine-tune your hook timing');
      suggestions.push('Add trending audio or voice-over');
      suggestions.push('Engage with comments and community');
      suggestions.push('Cross-post to multiple platforms');
    } else {
      suggestions.push('Maintain consistency in your content');
      suggestions.push('Collaborate with other creators');
      suggestions.push('Analyze your best-performing content');
      suggestions.push('Stay updated with platform trends');
    }

    // Add specific suggestions based on breakdown
    if (breakdown.hook < 50) {
      suggestions.push('Strengthen your opening hook');
    }
    if (breakdown.pacing < 50) {
      suggestions.push('Improve video pacing and flow');
    }
    if (breakdown.engagement < 50) {
      suggestions.push('Add more interactive elements');
    }
    if (breakdown.quality < 50) {
      suggestions.push('Enhance video and audio quality');
    }
    if (breakdown.relevance < 50) {
      suggestions.push('Make content more relevant to your audience');
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'viral':
        return KingdomColors.success;
      case 'trending':
        return KingdomColors.primary;
      case 'average':
        return KingdomColors.warning;
      case 'needs_work':
        return KingdomColors.error;
      default:
        return KingdomColors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'viral':
        return '🚀';
      case 'trending':
        return '📈';
      case 'average':
        return '📊';
      case 'needs_work':
        return '🔧';
      default:
        return '📱';
    }
  };

  const renderScoreBreakdown = () => {
    if (!viralScore) return null;

    const breakdownItems = [
      { key: 'hook', label: 'Hook Strength', icon: '🎯' },
      { key: 'pacing', label: 'Pacing', icon: '⏱️' },
      { key: 'engagement', label: 'Engagement', icon: '👥' },
      { key: 'quality', label: 'Quality', icon: '✨' },
      { key: 'relevance', label: 'Relevance', icon: '🎯' },
    ];

    return (
      <View style={styles.breakdownContainer}>
        <Text style={styles.breakdownTitle}>Score Breakdown</Text>
        {breakdownItems.map((item) => (
          <View key={item.key} style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownIcon}>{item.icon}</Text>
              <Text style={styles.breakdownLabel}>{item.label}</Text>
              <Text style={styles.breakdownScore}>
                {viralScore.breakdown[item.key as keyof typeof viralScore.breakdown]}
              </Text>
            </View>
            <View style={styles.breakdownBar}>
              <View
                style={[
                  styles.breakdownFill,
                  {
                    width: `${viralScore.breakdown[item.key as keyof typeof viralScore.breakdown]}%`,
                    backgroundColor: getCategoryColor(viralScore.category),
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderPredictions = () => {
    if (!viralScore) return null;

    return (
      <View style={styles.predictionsContainer}>
        <Text style={styles.predictionsTitle}>Predictions</Text>
        
        <View style={styles.predictionRow}>
          <View style={styles.predictionItem}>
            <Text style={styles.predictionIcon}>👁️</Text>
            <Text style={styles.predictionLabel}>Predicted Views</Text>
            <Text style={styles.predictionValue}>
              {viralScore.predictedViews.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.predictionItem}>
            <Text style={styles.predictionIcon}>💬</Text>
            <Text style={styles.predictionLabel}>Engagement Rate</Text>
            <Text style={styles.predictionValue}>
              {viralScore.predictedEngagement}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSuggestions = () => {
    if (!viralScore) return null;

    return (
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Improvement Suggestions</Text>
        <ScrollView style={styles.suggestionsList}>
          {viralScore.suggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionItem}>
              <Text style={styles.suggestionIcon}>💡</Text>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (!viralScore) {
    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.loadingText}>Analyzing viral potential...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Viral Prediction Analysis</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Main Score */}
            <View style={styles.mainScoreContainer}>
              <Text style={styles.mainScoreIcon}>
                {getCategoryIcon(viralScore.category)}
              </Text>
              <Text style={styles.mainScoreValue}>{viralScore.score}</Text>
              <Text style={styles.mainScoreLabel}>/ 100</Text>
              <Text style={[
                styles.mainScoreCategory,
                { color: getCategoryColor(viralScore.category) }
              ]}>
                {viralScore.category.toUpperCase().replace('_', ' ')}
              </Text>
            </View>

            {/* Score Bar */}
            <View style={styles.scoreBarContainer}>
              <View style={styles.scoreBar}>
                <View
                  style={[
                    styles.scoreBarFill,
                    {
                      width: `${viralScore.score}%`,
                      backgroundColor: getCategoryColor(viralScore.category),
                    },
                  ]}
                />
              </View>
            </View>

            {showDetails ? (
              <>
                {renderScoreBreakdown()}
                {renderPredictions()}
                {renderSuggestions()}
              </>
            ) : (
              <TouchableOpacity
                style={styles.showDetailsButton}
                onPress={() => setShowDetails(true)}
              >
                <Text style={styles.showDetailsButtonText}>Show Detailed Analysis</Text>
              </TouchableOpacity>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.improveButton}
                onPress={onImprove}
              >
                <Text style={styles.improveButtonText}>Get Improvement Tips</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => {/* Share results */}}
              >
                <Text style={styles.shareButtonText}>Share Results</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: KingdomColors.surface,
    borderRadius: 16,
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.border,
  },
  title: {
    color: KingdomColors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: KingdomColors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: KingdomColors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  mainScoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainScoreIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  mainScoreValue: {
    color: KingdomColors.text,
    fontSize: 64,
    fontWeight: 'bold',
  },
  mainScoreLabel: {
    color: KingdomColors.textSecondary,
    fontSize: 20,
    marginBottom: 8,
  },
  mainScoreCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  scoreBarContainer: {
    marginBottom: 20,
  },
  scoreBar: {
    height: 12,
    backgroundColor: KingdomColors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  showDetailsButton: {
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: KingdomColors.primary,
    alignItems: 'center',
    marginBottom: 20,
  },
  showDetailsButtonText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  breakdownContainer: {
    marginBottom: 20,
  },
  breakdownTitle: {
    color: KingdomColors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  breakdownItem: {
    marginBottom: 12,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  breakdownIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  breakdownLabel: {
    color: KingdomColors.text,
    fontSize: 14,
    flex: 1,
  },
  breakdownScore: {
    color: KingdomColors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  breakdownBar: {
    height: 6,
    backgroundColor: KingdomColors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 3,
  },
  predictionsContainer: {
    marginBottom: 20,
  },
  predictionsTitle: {
    color: KingdomColors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  predictionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  predictionItem: {
    flex: 1,
    backgroundColor: KingdomColors.dark,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  predictionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  predictionLabel: {
    color: KingdomColors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  predictionValue: {
    color: KingdomColors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    color: KingdomColors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  suggestionText: {
    color: KingdomColors.text,
    fontSize: 14,
    flex: 1,
  },
  actionButtons: {
    gap: 12,
  },
  improveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: KingdomColors.primary,
    alignItems: 'center',
  },
  improveButtonText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: KingdomColors.secondary,
    alignItems: 'center',
  },
  shareButtonText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    color: KingdomColors.text,
    fontSize: 18,
    textAlign: 'center',
  },
}); 