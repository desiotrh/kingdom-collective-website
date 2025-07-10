import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useAppNavigation } from '../../utils/navigationUtils';
import { useDualMode } from '../../contexts/DualModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTierSystem } from '../../contexts/TierSystemContext';
import subscriptionService from '../../services/subscriptionService';
import { KingdomColors, KingdomShadows } from '../../constants/KingdomColors';
import KingdomLogo from '../../components/KingdomLogo';
import ModeToggle from '../../components/ModeToggle';

const { width, height } = Dimensions.get('window');

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  mood: string;
  bpm?: number;
  tags: string[];
  previewUrl: string;
  fullUrl: string;
  waveform: string;
  coverArt: string;
  isRoyaltyFree: boolean;
  isPremium: boolean;
  faithMode?: {
    title: string;
    artist: string;
    tags: string[];
  };
}

interface AudioProject {
  id: string;
  name: string;
  tracks: AudioTrack[];
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

const AudioStudioScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { currentMode, modeConfig, getModeSpecificContent, userTier } = useDualMode();
  const { user } = useAuth();
  const { currentTier, subscription, checkFeatureAccess, upgradeSubscription } = useTierSystem();
  
  const [activeTab, setActiveTab] = useState<'library' | 'projects' | 'editor'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [projects, setProjects] = useState<AudioProject[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<AudioTrack[]>([]);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Load usage stats and check tier limits
  useEffect(() => {
    loadUsageStats();
  }, [currentTier]);

  const loadUsageStats = async () => {
    try {
      const stats = await subscriptionService.getUsageStats();
      setUsageStats(stats);
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  };

  // Tier-based feature access
  const getTierLimits = () => {
    switch (currentTier) {
      case 'seed':
        return {
          audioDownloads: 5,
          projectsLimit: 3,
          premiumTracks: false,
          audioEditing: false,
          teamCollaboration: false,
        };
      case 'rooted':
        return {
          audioDownloads: 25,
          projectsLimit: 10,
          premiumTracks: true,
          audioEditing: true,
          teamCollaboration: false,
        };
      case 'commissioned':
        return {
          audioDownloads: 100,
          projectsLimit: 50,
          premiumTracks: true,
          audioEditing: true,
          teamCollaboration: true,
        };
      case 'mantled_pro':
        return {
          audioDownloads: 500,
          projectsLimit: 200,
          premiumTracks: true,
          audioEditing: true,
          teamCollaboration: true,
        };
      case 'kingdom_enterprise':
        return {
          audioDownloads: -1, // Unlimited
          projectsLimit: -1, // Unlimited
          premiumTracks: true,
          audioEditing: true,
          teamCollaboration: true,
        };
      default:
        return {
          audioDownloads: 5,
          projectsLimit: 3,
          premiumTracks: false,
          audioEditing: false,
          teamCollaboration: false,
        };
    }
  };

  const tierLimits = getTierLimits();

  // Check if user can access premium track
  const canAccessPremiumTrack = (track: AudioTrack) => {
    if (!track.isPremium) return true;
    return tierLimits.premiumTracks;
  };

  // Check if user can download more tracks
  const canDownloadTrack = () => {
    if (tierLimits.audioDownloads === -1) return true;
    const currentDownloads = usageStats?.audioDownloads?.used || 0;
    return currentDownloads < tierLimits.audioDownloads;
  };

  // Handle premium track access
  const handlePremiumTrackAccess = (track: AudioTrack) => {
    if (canAccessPremiumTrack(track)) {
      return true;
    }
    
    Alert.alert(
      '🎵 Premium Track',
      `This track requires ${track.isPremium ? 'a paid subscription' : 'upgrade'}. Upgrade to access premium audio content!`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => setShowUpgradeModal(true) }
      ]
    );
    return false;
  };

  // Handle download with tier limits
  const handleDownloadTrack = async (track: AudioTrack) => {
    if (!canDownloadTrack()) {
      Alert.alert(
        '⚡ Download Limit Reached',
        `You've reached your ${tierLimits.audioDownloads} downloads limit. Upgrade for more downloads!`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => setShowUpgradeModal(true) }
        ]
      );
      return;
    }

    if (!handlePremiumTrackAccess(track)) {
      return;
    }

    try {
      // Track usage
      await subscriptionService.trackUsage('audioDownloads', 1);
      await loadUsageStats(); // Refresh stats
      
      // Implement actual download logic here
      Alert.alert('✅ Download Started', `Downloading "${track.title}"...`);
    } catch (error) {
      Alert.alert('❌ Download Failed', 'Please try again.');
    }
  };

  // Mock audio library with faith-based and general tracks
  const audioLibrary: AudioTrack[] = [
    // Faith Mode Tracks
    {
      id: 'faith-1',
      title: 'Kingdom Anthem',
      artist: 'Kingdom Studios',
      duration: 180,
      genre: 'Worship',
      mood: 'Uplifting',
      bpm: 120,
      tags: ['worship', 'kingdom', 'victory', 'anthem'],
      previewUrl: 'https://example.com/preview/kingdom-anthem.mp3',
      fullUrl: 'https://example.com/full/kingdom-anthem.mp3',
      waveform: 'https://example.com/waveform/kingdom-anthem.png',
      coverArt: 'https://picsum.photos/300/300?random=1',
      isRoyaltyFree: true,
      isPremium: false,
      faithMode: {
        title: 'Kingdom Anthem',
        artist: 'Kingdom Studios',
        tags: ['worship', 'kingdom', 'victory', 'anthem']
      }
    },
    {
      id: 'faith-2',
      title: 'Heavenly Peace',
      artist: 'Serenity Collective',
      duration: 240,
      genre: 'Ambient',
      mood: 'Peaceful',
      bpm: 70,
      tags: ['peace', 'meditation', 'prayer', 'healing'],
      previewUrl: 'https://example.com/preview/heavenly-peace.mp3',
      fullUrl: 'https://example.com/full/heavenly-peace.mp3',
      waveform: 'https://example.com/waveform/heavenly-peace.png',
      coverArt: 'https://picsum.photos/300/300?random=2',
      isRoyaltyFree: true,
      isPremium: true,
    },
    // General/Encouragement Mode Tracks
    {
      id: 'general-1',
      title: 'Rising Above',
      artist: 'Motivation Masters',
      duration: 200,
      genre: 'Inspirational',
      mood: 'Motivational',
      bpm: 128,
      tags: ['success', 'motivation', 'growth', 'determination'],
      previewUrl: 'https://example.com/preview/rising-above.mp3',
      fullUrl: 'https://example.com/full/rising-above.mp3',
      waveform: 'https://example.com/waveform/rising-above.png',
      coverArt: 'https://picsum.photos/300/300?random=3',
      isRoyaltyFree: true,
      isPremium: false,
    },
    {
      id: 'general-2',
      title: 'Focused Flow',
      artist: 'Productivity Pro',
      duration: 300,
      genre: 'Focus',
      mood: 'Concentrated',
      bpm: 90,
      tags: ['focus', 'productivity', 'work', 'concentration'],
      previewUrl: 'https://example.com/preview/focused-flow.mp3',
      fullUrl: 'https://example.com/full/focused-flow.mp3',
      waveform: 'https://example.com/waveform/focused-flow.png',
      coverArt: 'https://picsum.photos/300/300?random=4',
      isRoyaltyFree: true,
      isPremium: true,
    }
  ];

  const genres = currentMode === 'faith' 
    ? ['all', 'Worship', 'Ambient', 'Gospel', 'Christian Rock', 'Praise']
    : ['all', 'Inspirational', 'Focus', 'Ambient', 'Upbeat', 'Cinematic'];

  const moods = currentMode === 'faith'
    ? ['all', 'Uplifting', 'Peaceful', 'Powerful', 'Contemplative', 'Joyful']
    : ['all', 'Motivational', 'Peaceful', 'Energetic', 'Concentrated', 'Positive'];

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playPreview = async (track: AudioTrack) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      if (currentlyPlaying === track.id && isPlaying) {
        setIsPlaying(false);
        setCurrentlyPlaying(null);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: track.previewUrl });
      setSound(newSound);
      setCurrentlyPlaying(track.id);
      setCurrentTrack(track);
      setIsPlaying(true);
      setShowPlayer(true);

      await newSound.playAsync();
      
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          setCurrentlyPlaying(null);
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to play audio preview');
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    setIsPlaying(false);
    setCurrentlyPlaying(null);
    setSound(null);
  };

  const addToProject = (track: AudioTrack) => {
    if (userTier === 'free' && selectedTracks.length >= 2) {
      Alert.alert(
        'Upgrade Required',
        getModeSpecificContent(
          'Kingdom Starter plan allows 2 tracks per project. Upgrade to Kingdom Creator for unlimited tracks!',
          'Creator Starter plan allows 2 tracks per project. Upgrade to Creator Pro for unlimited tracks!'
        ),
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('TierSystem') }
        ]
      );
      return;
    }

    if (track.isPremium && (userTier === 'free' || userTier === 'creator')) {
      Alert.alert(
        'Premium Track',
        getModeSpecificContent(
          'This track requires Kingdom Leader tier or higher.',
          'This track requires Creator Elite tier or higher.'
        ),
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('TierSystem') }
        ]
      );
      return;
    }

    setSelectedTracks(prev => [...prev, track]);
    Alert.alert('Added', `"${track.title}" added to your project!`);
  };

  const filteredTracks = audioLibrary.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    const matchesMood = selectedMood === 'all' || track.mood === selectedMood;

    // Show faith tracks in faith mode, general tracks in encouragement mode
    const modeMatch = currentMode === 'faith' 
      ? track.faithMode || track.tags.some(tag => ['worship', 'kingdom', 'prayer', 'faith'].includes(tag))
      : !track.faithMode || track.tags.some(tag => ['motivation', 'success', 'focus', 'positive'].includes(tag));

    return matchesSearch && matchesGenre && matchesMood && modeMatch;
  });

  const renderTrackCard = (track: AudioTrack) => {
    const canAccess = canAccessPremiumTrack(track);
    const canDownload = canDownloadTrack();
    
    return (
      <TouchableOpacity 
        key={track.id} 
        style={[
          styles.trackCard, 
          !canAccess && styles.trackCardDisabled
        ]} 
        activeOpacity={0.9}
        onPress={() => canAccess ? null : handlePremiumTrackAccess(track)}
      >
        <BlurView intensity={20} style={styles.trackBlur}>
          <LinearGradient
            colors={
              canAccess 
                ? ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
                : ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)']
            }
            style={styles.trackGradient}
          >
            <View style={styles.trackContent}>
              <View style={styles.trackImageContainer}>
                <Image source={{ uri: track.coverArt }} style={[
                  styles.trackArt,
                  !canAccess && styles.trackArtDisabled
                ]} />
                {renderTierBadge(track)}
                {!canAccess && (
                  <View style={styles.lockOverlay}>
                    <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
                  </View>
                )}
              </View>
              
              <View style={styles.trackInfo}>
                <Text style={[
                  styles.trackTitle,
                  !canAccess && styles.trackTitleDisabled
                ]}>
                  {track.title}
                </Text>
                <Text style={[
                  styles.trackArtist,
                  !canAccess && styles.trackArtistDisabled
                ]}>
                  {track.artist}
                </Text>
                <View style={styles.trackMeta}>
                  <Text style={styles.trackGenre}>{track.genre}</Text>
                  <Text style={styles.trackDuration}>
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </Text>
                  {track.bpm && <Text style={styles.trackBpm}>{track.bpm} BPM</Text>}
                </View>
                <View style={styles.trackTags}>
                  {track.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={[
                      styles.tag,
                      !canAccess && styles.tagDisabled
                    ]}>
                      <Text style={[
                        styles.tagText,
                        !canAccess && styles.tagTextDisabled
                      ]}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.trackActions}>
                <TouchableOpacity
                  style={[
                    styles.playButton,
                    currentlyPlaying === track.id && isPlaying && styles.playingButton,
                    !canAccess && styles.playButtonDisabled
                  ]}
                  onPress={() => canAccess ? playPreview(track) : handlePremiumTrackAccess(track)}
                >
                  <Ionicons
                    name={
                      !canAccess 
                        ? 'lock-closed'
                        : currentlyPlaying === track.id && isPlaying 
                          ? 'pause' 
                          : 'play'
                    }
                    size={20}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.addButton,
                    !canAccess && styles.addButtonDisabled
                  ]}
                  onPress={() => canAccess ? addToProject(track) : handlePremiumTrackAccess(track)}
                >
                  <Ionicons 
                    name={canAccess ? "add" : "lock-closed"} 
                    size={20} 
                    color={canAccess ? modeConfig.colors.primary : '#9CA3AF'} 
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.downloadButton,
                    (!canAccess || !canDownload) && styles.downloadButtonDisabled
                  ]}
                  onPress={() => {
                    if (!canAccess) {
                      handlePremiumTrackAccess(track);
                    } else if (!canDownload) {
                      Alert.alert(
                        '⚡ Download Limit Reached',
                        `Upgrade to download more tracks this month!`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Upgrade', onPress: () => setShowUpgradeModal(true) }
                        ]
                      );
                    } else {
                      handleDownloadTrack(track);
                    }
                  }}
                >
                  <Ionicons 
                    name={
                      !canAccess || !canDownload 
                        ? "lock-closed" 
                        : "download-outline"
                    } 
                    size={18} 
                    color={canAccess && canDownload ? modeConfig.colors.primary : '#9CA3AF'} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    );
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {/* Genre Filters */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Genre</Text>
          <View style={styles.filterOptions}>
            {genres.map((genre) => (
              <TouchableOpacity
                key={genre}
                style={[
                  styles.filterChip,
                  selectedGenre === genre && styles.activeFilterChip
                ]}
                onPress={() => setSelectedGenre(genre)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedGenre === genre && styles.activeFilterChipText
                ]}>
                  {genre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mood Filters */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Mood</Text>
          <View style={styles.filterOptions}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.filterChip,
                  selectedMood === mood && styles.activeFilterChip
                ]}
                onPress={() => setSelectedMood(mood)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedMood === mood && styles.activeFilterChipText
                ]}>
                  {mood}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderLibraryTab = () => (
    <View style={styles.tabContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={KingdomColors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={getModeSpecificContent('Search Kingdom music library...', 'Search music library...')}
          placeholderTextColor={KingdomColors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      {renderFilters()}

      {/* Track List */}
      <ScrollView style={styles.trackList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {getModeSpecificContent('Kingdom Music Library', 'Creator Music Library')} ({filteredTracks.length})
        </Text>
        {filteredTracks.map(renderTrackCard)}
      </ScrollView>
    </View>
  );

  const renderProjectsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.projectsHeader}>
        <Text style={styles.sectionTitle}>My Audio Projects</Text>
        <TouchableOpacity style={styles.newProjectButton}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.newProjectText}>New Project</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.projectsList} showsVerticalScrollIndicator={false}>
        {projects.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="musical-notes" size={64} color={KingdomColors.text.secondary} />
            <Text style={styles.emptyStateTitle}>No Projects Yet</Text>
            <Text style={styles.emptyStateText}>
              {getModeSpecificContent(
                'Create your first Kingdom audio project to get started!',
                'Create your first audio project to get started!'
              )}
            </Text>
          </View>
        ) : (
          projects.map((project) => (
            <TouchableOpacity key={project.id} style={styles.projectCard}>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.projectMeta}>
                {project.tracks.length} tracks • {Math.floor(project.duration / 60)}m
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderAudioPlayer = () => (
    <Modal
      visible={showPlayer}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowPlayer(false)}
    >
      <LinearGradient
        colors={[KingdomColors.background.primary, KingdomColors.background.secondary]}
        style={styles.playerModal}
      >
        <SafeAreaView style={styles.playerContainer}>
          <View style={styles.playerHeader}>
            <TouchableOpacity onPress={() => setShowPlayer(false)}>
              <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.playerTitle}>Now Playing</Text>
            <View style={styles.playerSpacer} />
          </View>

          {currentTrack && (
            <View style={styles.playerContent}>
              <Image source={{ uri: currentTrack.coverArt }} style={styles.playerArt} />
              <Text style={styles.playerTrackTitle}>{currentTrack.title}</Text>
              <Text style={styles.playerArtist}>{currentTrack.artist}</Text>

              <View style={styles.playerControls}>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="play-skip-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.playPauseButton}
                  onPress={() => isPlaying ? stopPlayback() : playPreview(currentTrack)}
                >
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={32}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="play-skip-forward" size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );

  // Render tier badge for tracks
  const renderTierBadge = (track: AudioTrack) => {
    if (!track.isPremium) return null;
    
    const tierRequired = track.isPremium ? 'Rooted+' : 'Free';
    const canAccess = canAccessPremiumTrack(track);
    
    return (
      <View style={[styles.tierBadge, { backgroundColor: canAccess ? modeConfig.colors.secondary : '#EF4444' }]}>
        <Text style={styles.tierBadgeText}>
          {canAccess ? '✓ Premium' : '🔒 Premium'}
        </Text>
      </View>
    );
  };

  // Render usage indicator
  const renderUsageIndicator = () => {
    if (!usageStats || tierLimits.audioDownloads === -1) return null;

    const used = usageStats.audioDownloads?.used || 0;
    const limit = tierLimits.audioDownloads;
    const percentage = (used / limit) * 100;

    return (
      <View style={[styles.usageIndicator, { backgroundColor: modeConfig.colors.surface }]}>
        <View style={styles.usageHeader}>
          <Text style={[styles.usageTitle, { color: modeConfig.colors.text }]}>
            Downloads This Month
          </Text>
          <TouchableOpacity onPress={() => setShowUpgradeModal(true)}>
            <Text style={[styles.upgradeLink, { color: modeConfig.colors.primary }]}>
              Upgrade
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.usageBar, { backgroundColor: modeConfig.colors.border }]}>
          <View 
            style={[
              styles.usageProgress, 
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: percentage > 80 ? '#EF4444' : modeConfig.colors.primary
              }
            ]} 
          />
        </View>
        <Text style={[styles.usageText, { color: modeConfig.colors.textSecondary }]}>
          {used} of {limit} downloads used
        </Text>
      </View>
    );
  };

  // Render upgrade modal
  const renderUpgradeModal = () => (
    <Modal
      visible={showUpgradeModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowUpgradeModal(false)}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: modeConfig.colors.background }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: modeConfig.colors.text }]}>
            🎵 Upgrade Your Audio Experience
          </Text>
          <TouchableOpacity 
            onPress={() => setShowUpgradeModal(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color={modeConfig.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.modalSubtitle, { color: modeConfig.colors.textSecondary }]}>
            Unlock premium audio content and advanced features
          </Text>

          {/* Current tier status */}
          <View style={[styles.currentTierCard, { backgroundColor: modeConfig.colors.surface }]}>
            <Text style={[styles.currentTierTitle, { color: modeConfig.colors.text }]}>
              Current: {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Tier
            </Text>
            <Text style={[styles.currentTierLimits, { color: modeConfig.colors.textSecondary }]}>
              • {tierLimits.audioDownloads === -1 ? 'Unlimited' : tierLimits.audioDownloads} downloads/month{'\n'}
              • {tierLimits.projectsLimit === -1 ? 'Unlimited' : tierLimits.projectsLimit} projects{'\n'}
              • {tierLimits.premiumTracks ? 'Premium tracks included' : 'Basic tracks only'}{'\n'}
              • {tierLimits.audioEditing ? 'Audio editing tools' : 'No editing tools'}{'\n'}
              • {tierLimits.teamCollaboration ? 'Team collaboration' : 'Individual use only'}
            </Text>
          </View>

          {/* Upgrade options */}
          <View style={styles.upgradeOptions}>
            {currentTier === 'seed' && (
              <TouchableOpacity 
                style={[styles.upgradeOption, { backgroundColor: modeConfig.colors.primary }]}
                onPress={() => handleUpgrade('rooted')}
              >
                <Text style={styles.upgradeOptionTitle}>Rooted - $30/month</Text>
                <Text style={styles.upgradeOptionFeatures}>
                  • 25 downloads/month{'\n'}
                  • Premium tracks{'\n'}
                  • Audio editing tools{'\n'}
                  • 10 projects
                </Text>
              </TouchableOpacity>
            )}
            
            {(currentTier === 'seed' || currentTier === 'rooted') && (
              <TouchableOpacity 
                style={[styles.upgradeOption, { backgroundColor: modeConfig.colors.secondary, marginTop: 15 }]}
                onPress={() => handleUpgrade('commissioned')}
              >
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                </View>
                <Text style={styles.upgradeOptionTitle}>Commissioned - $50/month</Text>
                <Text style={styles.upgradeOptionFeatures}>
                  • 100 downloads/month{'\n'}
                  • All premium content{'\n'}
                  • Advanced editing{'\n'}
                  • Team collaboration{'\n'}
                  • 50 projects{'\n'}
                  • 14-day free trial
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.fullTierButton, { backgroundColor: modeConfig.colors.accent }]}
            onPress={() => {
              setShowUpgradeModal(false);
              navigation.navigate('TierSelection');
            }}
          >
            <Text style={styles.fullTierButtonText}>View All Plans</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const handleUpgrade = async (tier: 'rooted' | 'commissioned' | 'mantled_pro') => {
    try {
      setShowUpgradeModal(false);
      const result = await upgradeSubscription(tier, 'monthly');
      if (result) {
        Alert.alert('🎉 Upgrade Successful!', 'You now have access to premium audio features.');
        await loadUsageStats();
      }
    } catch (error) {
      Alert.alert('❌ Upgrade Failed', 'Please try again or contact support.');
    }
  };

  const renderLibrary = () => (
    <View style={styles.libraryContainer}>
      {/* Usage Indicator */}
      {renderUsageIndicator()}
      
      {/* Search and Filters */}
      <View style={[styles.searchContainer, { backgroundColor: modeConfig.colors.surface }]}>
        <Ionicons name="search" size={20} color={modeConfig.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: modeConfig.colors.text }]}
          placeholder="Search audio tracks..."
          placeholderTextColor={modeConfig.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {renderFilters()}
      
      {/* Track Grid */}
      <ScrollView style={styles.trackGrid} showsVerticalScrollIndicator={false}>
        {filteredTracks.map(renderTrackCard)}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: modeConfig.colors.background }]}>
      <LinearGradient
        colors={modeConfig.colors.gradient}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={modeConfig.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: modeConfig.colors.text }]}>
              Audio Studio
            </Text>
            <ModeToggle />
          </View>
          
          {/* Tier Status */}
          <View style={[styles.tierStatus, { backgroundColor: modeConfig.colors.surface }]}>
            <Text style={[styles.tierStatusText, { color: modeConfig.colors.text }]}>
              {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Tier
            </Text>
            {currentTier === 'seed' && (
              <TouchableOpacity 
                onPress={() => setShowUpgradeModal(true)}
                style={[styles.upgradeButton, { backgroundColor: modeConfig.colors.primary }]}
              >
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['library', 'projects', 'editor'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && [styles.activeTab, { backgroundColor: modeConfig.colors.primary }]
              ]}
              onPress={() => setActiveTab(tab as 'library' | 'projects' | 'editor')}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === tab ? '#FFFFFF' : modeConfig.colors.textSecondary }
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {activeTab === 'library' && renderLibrary()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'editor' && renderEditor()}
        
        {/* Modals */}
        {renderUpgradeModal()}
        {renderAudioPlayer()}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AudioStudioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  // Tier-based styles
  tierBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  tierBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  usageIndicator: {
    margin: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  upgradeLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  usageBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  usageProgress: {
    height: '100%',
    borderRadius: 3,
  },
  usageText: {
    fontSize: 12,
  },
  trackCardDisabled: {
    opacity: 0.6,
  },
  trackImageContainer: {
    position: 'relative',
  },
  trackArtDisabled: {
    opacity: 0.5,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
  },
  trackTitleDisabled: {
    opacity: 0.7,
  },
  trackArtistDisabled: {
    opacity: 0.7,
  },
  tagDisabled: {
    opacity: 0.5,
  },
  tagTextDisabled: {
    opacity: 0.7,
  },
  playButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  downloadButtonDisabled: {
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
  },
  tierStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  tierStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  upgradeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  currentTierCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  currentTierTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  currentTierLimits: {
    fontSize: 14,
    lineHeight: 20,
  },
  upgradeOptions: {
    marginBottom: 20,
  },
  upgradeOption: {
    padding: 20,
    borderRadius: 12,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  popularBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  upgradeOptionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  upgradeOptionFeatures: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  fullTierButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  fullTierButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  libraryContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  trackGrid: {
    flex: 1,
    paddingHorizontal: 10,
  },
  tabContent: {
    flex: 1,
    paddingBottom: 20,
  },
  filtersContainer: {
    marginBottom: 15,
  },
  filterScroll: {
    paddingLeft: 15,
    paddingRight: 5,
  },
  filterGroup: {
    marginRight: 20,
  },
  filterLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  activeFilterChip: {
    backgroundColor: modeConfig.colors.primary,
  },
  filterChipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trackList: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  projectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  newProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: modeConfig.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  newProjectText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  projectsList: {
    paddingHorizontal: 15,
  },
  projectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  projectName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  projectMeta: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  playerModal: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  playerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  playerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  playerSpacer: {
    width: 24,
  },
  playerContent: {
    alignItems: 'center',
    width: '100%',
  },
  playerArt: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 15,
  },
  playerTrackTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
  },
  playerArtist: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  controlButton: {
    padding: 10,
  },
  playPauseButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: modeConfig.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  // ...existing styles...
});
