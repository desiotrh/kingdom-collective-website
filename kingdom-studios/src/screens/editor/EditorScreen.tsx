import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors } from '../../constants/KingdomColors';

interface MediaProject {
  id: string;
  name: string;
  type: 'photo' | 'video';
  thumbnail: string;
  duration?: string;
  lastModified: string;
  size: string;
}

interface EditingTool {
  id: string;
  name: string;
  icon: string;
  category: 'basic' | 'effects' | 'text' | 'audio';
  description: string;
}

export default function EditorScreen() {
  const [activeTab, setActiveTab] = useState<'projects' | 'photo' | 'video'>('projects');
  const [selectedProject, setSelectedProject] = useState<MediaProject | null>(null);
  
  const [projects, setProjects] = useState<MediaProject[]>([
    {
      id: '1',
      name: 'Kingdom Impact Reel',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/150x150/2D1B69/FFD700?text=Video',
      duration: '0:30',
      lastModified: '2024-03-15',
      size: '45.2 MB',
    },
    {
      id: '2',
      name: 'Faith Quote Post',
      type: 'photo',
      thumbnail: 'https://via.placeholder.com/150x150/2D1B69/FFD700?text=Photo',
      lastModified: '2024-03-14',
      size: '2.1 MB',
    },
    {
      id: '3',
      name: 'Product Showcase',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/150x150/2D1B69/FFD700?text=Video',
      duration: '1:15',
      lastModified: '2024-03-13',
      size: '128.7 MB',
    },
  ]);

  const photoTools: EditingTool[] = [
    { id: '1', name: 'Crop & Resize', icon: 'crop-outline', category: 'basic', description: 'Adjust image dimensions' },
    { id: '2', name: 'Brightness', icon: 'sunny-outline', category: 'basic', description: 'Adjust lighting' },
    { id: '3', name: 'Contrast', icon: 'contrast-outline', category: 'basic', description: 'Enhance image contrast' },
    { id: '4', name: 'Filters', icon: 'color-filter-outline', category: 'effects', description: 'Apply visual filters' },
    { id: '5', name: 'Text Overlay', icon: 'text-outline', category: 'text', description: 'Add custom text' },
    { id: '6', name: 'Remove Background', icon: 'layers-outline', category: 'effects', description: 'Create transparent PNG' },
  ];

  const videoTools: EditingTool[] = [
    { id: '1', name: 'Trim', icon: 'cut-outline', category: 'basic', description: 'Cut video segments' },
    { id: '2', name: 'Text Overlay', icon: 'text-outline', category: 'text', description: 'Add captions' },
    { id: '3', name: 'Auto Captions', icon: 'chatbubbles-outline', category: 'text', description: 'AI-generated subtitles' },
    { id: '4', name: 'Crop & Resize', icon: 'crop-outline', category: 'basic', description: 'Adjust video dimensions' },
    { id: '5', name: 'Music', icon: 'musical-notes-outline', category: 'audio', description: 'Add background music' },
    { id: '6', name: 'Speed Control', icon: 'speedometer-outline', category: 'effects', description: 'Slow-mo or time-lapse' },
    { id: '7', name: 'Transitions', icon: 'shuffle-outline', category: 'effects', description: 'Scene transitions' },
    { id: '8', name: 'Export', icon: 'download-outline', category: 'basic', description: 'Save final video' },
  ];

  const handleCreateNew = (type: 'photo' | 'video') => {
    Alert.alert(
      `Create New ${type.charAt(0).toUpperCase() + type.slice(1)} Project`,
      'This would open the device camera or file picker',
      [
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Gallery', onPress: () => console.log('Open gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleToolPress = (tool: EditingTool) => {
    Alert.alert(
      tool.name,
      tool.description + '\n\nThis feature would open the editing interface.',
      [{ text: 'OK' }]
    );
  };

  const renderProjectCard = (project: MediaProject) => (
    <TouchableOpacity
      key={project.id}
      style={styles.projectCard}
      onPress={() => setSelectedProject(project)}
    >
      <Image source={{ uri: project.thumbnail }} style={styles.projectThumbnail} />
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{project.name}</Text>
        <View style={styles.projectMeta}>
          <View style={styles.metaItem}>
            <Ionicons 
              name={project.type === 'video' ? 'videocam-outline' : 'image-outline'} 
              size={14} 
              color={KingdomColors.text.secondary} 
            />
            <Text style={styles.metaText}>{project.type}</Text>
          </View>
          {project.duration && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={KingdomColors.text.secondary} />
              <Text style={styles.metaText}>{project.duration}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Ionicons name="folder-outline" size={14} color={KingdomColors.text.secondary} />
            <Text style={styles.metaText}>{project.size}</Text>
          </View>
        </View>
        <Text style={styles.lastModified}>Modified: {project.lastModified}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color={KingdomColors.text.secondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderToolCard = (tool: EditingTool) => {
    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'basic': return KingdomColors.primary.royalPurple;
        case 'effects': return KingdomColors.gold.bright;
        case 'text': return KingdomColors.accent.info;
        case 'audio': return KingdomColors.accent.success;
        default: return KingdomColors.text.secondary;
      }
    };

    return (
      <TouchableOpacity
        key={tool.id}
        style={[styles.toolCard, { borderLeftColor: getCategoryColor(tool.category) }]}
        onPress={() => handleToolPress(tool)}
      >
        <View style={[styles.toolIcon, { backgroundColor: getCategoryColor(tool.category) + '20' }]}>
          <Ionicons name={tool.icon as any} size={24} color={getCategoryColor(tool.category)} />
        </View>
        <View style={styles.toolInfo}>
          <Text style={styles.toolName}>{tool.name}</Text>
          <Text style={styles.toolDescription}>{tool.description}</Text>
          <Text style={[styles.toolCategory, { color: getCategoryColor(tool.category) }]}>
            {tool.category.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProjectsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Media Projects</Text>
        <View style={styles.createButtons}>
          <TouchableOpacity 
            style={[styles.createButton, styles.photoButton]}
            onPress={() => handleCreateNew('photo')}
          >
            <Ionicons name="image-outline" size={20} color={KingdomColors.background.primary} />
            <Text style={styles.createButtonText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.createButton, styles.videoButton]}
            onPress={() => handleCreateNew('video')}
          >
            <Ionicons name="videocam-outline" size={20} color={KingdomColors.background.primary} />
            <Text style={styles.createButtonText}>Video</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.overview}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewNumber}>{projects.filter(p => p.type === 'photo').length}</Text>
          <Text style={styles.overviewLabel}>Photos</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewNumber}>{projects.filter(p => p.type === 'video').length}</Text>
          <Text style={styles.overviewLabel}>Videos</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewNumber}>
            {projects.reduce((total, p) => total + parseFloat(p.size), 0).toFixed(1)} MB
          </Text>
          <Text style={styles.overviewLabel}>Total Size</Text>
        </View>
      </View>
      
      {projects.map(renderProjectCard)}
    </ScrollView>
  );

  const renderPhotoTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Photo Editor</Text>
      <Text style={styles.subtitle}>Professional photo editing tools for creators</Text>
      
      <View style={styles.toolsGrid}>
        {photoTools.map(renderToolCard)}
      </View>
      
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Kingdom Features</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={20} color={KingdomColors.gold.bright} />
            <Text style={styles.featureText}>Faith-based templates and overlays</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="color-palette" size={20} color={KingdomColors.gold.bright} />
            <Text style={styles.featureText}>Kingdom color schemes</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="text" size={20} color={KingdomColors.gold.bright} />
            <Text style={styles.featureText}>Scripture and inspirational fonts</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderVideoTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Video Editor</Text>
      <Text style={styles.subtitle}>Create compelling videos that inspire and engage</Text>
      
      <View style={styles.toolsGrid}>
        {videoTools.map(renderToolCard)}
      </View>
      
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Kingdom Features</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="musical-notes" size={20} color={KingdomColors.gold.bright} />
            <Text style={styles.featureText}>Worship and inspirational music library</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="megaphone" size={20} color={KingdomColors.gold.bright} />
            <Text style={styles.featureText}>Auto-generated faith-based captions</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="sparkles" size={20} color={KingdomColors.gold.bright} />
            <Text style={styles.featureText}>Kingdom impact transitions and effects</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'projects' && styles.activeTab]}
          onPress={() => setActiveTab('projects')}
        >
          <Ionicons 
            name="folder-outline" 
            size={20} 
            color={activeTab === 'projects' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'projects' && styles.activeTabText]}>
            Projects
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'photo' && styles.activeTab]}
          onPress={() => setActiveTab('photo')}
        >
          <Ionicons 
            name="image-outline" 
            size={20} 
            color={activeTab === 'photo' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'photo' && styles.activeTabText]}>
            Photo
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'video' && styles.activeTab]}
          onPress={() => setActiveTab('video')}
        >
          <Ionicons 
            name="videocam-outline" 
            size={20} 
            color={activeTab === 'video' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'video' && styles.activeTabText]}>
            Video
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'projects' && renderProjectsTab()}
      {activeTab === 'photo' && renderPhotoTab()}
      {activeTab === 'video' && renderVideoTab()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.default.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: KingdomColors.primary.royalPurple,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: KingdomColors.text.secondary,
  },
  activeTabText: {
    color: KingdomColors.primary.royalPurple,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  createButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  photoButton: {
    backgroundColor: KingdomColors.accent.info,
  },
  videoButton: {
    backgroundColor: KingdomColors.accent.success,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.background.primary,
  },
  overview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  overviewCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    flex: 0.3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  overviewNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.primary.royalPurple,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
  projectCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  projectThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  projectMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metaText: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
  },
  lastModified: {
    fontSize: 11,
    color: KingdomColors.text.muted,
  },
  moreButton: {
    padding: 8,
  },
  toolsGrid: {
    gap: 12,
    marginBottom: 32,
  },
  toolCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
    borderLeftWidth: 4,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  toolInfo: {
    flex: 1,
  },
  toolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 2,
  },
  toolDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  toolCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  featuresSection: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
  },
});
