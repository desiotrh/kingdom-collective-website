import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFileStorage } from '../hooks/useFileStorage';

const FileManagerScreen: React.FC = () => {
  const {
    uploadedFiles,
    isUploading,
    error,
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    pickImage,
    takePhoto,
    pickDocument,
    formatFileSize,
    getFileTypeIcon,
    clearError
  } = useFileStorage();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFileDetails, setShowFileDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const folders = ['all', 'images', 'documents', 'videos', 'uploads'];

  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || 
      (selectedFolder === 'images' && file.type.startsWith('image/')) ||
      (selectedFolder === 'documents' && (file.type.includes('pdf') || file.type.includes('doc'))) ||
      (selectedFolder === 'videos' && file.type.startsWith('video/')) ||
      (selectedFolder === 'uploads' && file.folder === 'uploads');
    
    return matchesSearch && matchesFolder;
  });

  const handleUploadOption = async (type: 'image' | 'camera' | 'document') => {
    setShowUploadModal(false);
    
    try {
      let file = null;
      
      switch (type) {
        case 'image':
          file = await pickImage();
          break;
        case 'camera':
          file = await takePhoto();
          break;
        case 'document':
          file = await pickDocument();
          break;
      }
      
      if (file) {
        await uploadFile(file, {
          folder: type === 'document' ? 'documents' : 'images',
          generateThumbnail: type !== 'document'
        });
        
        Alert.alert('Success', 'File uploaded successfully!');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to upload file');
    }
  };

  const handleDeleteFile = (file: any) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete "${file.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFile(file.url);
              Alert.alert('Success', 'File deleted successfully');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete file');
            }
          }
        }
      ]
    );
  };

  const renderFile = ({ item: file }: { item: any }) => {
    const isImage = file.type.startsWith('image/');
    
    if (viewMode === 'grid') {
      return (
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => setShowFileDetails(file)}
        >
          <View style={styles.gridItemContent}>
            {isImage ? (
              <Image source={{ uri: file.url }} style={styles.gridImage} />
            ) : (
              <View style={styles.gridIconContainer}>
                <Ionicons 
                  name={getFileTypeIcon(file.type) as any} 
                  size={40} 
                  color="#667eea" 
                />
              </View>
            )}
            <Text style={styles.gridFileName} numberOfLines={2}>
              {file.name}
            </Text>
            <Text style={styles.gridFileSize}>
              {formatFileSize(file.size)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => setShowFileDetails(file)}
        >
          <View style={styles.listItemContent}>
            <View style={styles.listItemIcon}>
              {isImage ? (
                <Image source={{ uri: file.url }} style={styles.listImage} />
              ) : (
                <Ionicons 
                  name={getFileTypeIcon(file.type) as any} 
                  size={24} 
                  color="#667eea" 
                />
              )}
            </View>
            <View style={styles.listItemInfo}>
              <Text style={styles.listFileName} numberOfLines={1}>
                {file.name}
              </Text>
              <Text style={styles.listFileDetails}>
                {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.listItemAction}
              onPress={() => handleDeleteFile(file)}
            >
              <Ionicons name="trash" size={20} color="#f44336" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderFolderTab = (folder: string) => (
    <TouchableOpacity
      key={folder}
      style={[
        styles.folderTab,
        selectedFolder === folder && styles.activeFolderTab
      ]}
      onPress={() => setSelectedFolder(folder)}
    >
      <Text style={[
        styles.folderTabText,
        selectedFolder === folder && styles.activeFolderTabText
      ]}>
        {folder.charAt(0).toUpperCase() + folder.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#f44336" />
        <Text style={styles.errorTitle}>Unable to Load Files</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={clearError}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>File Manager</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Ionicons 
              name={viewMode === 'grid' ? 'list' : 'grid'} 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowUploadModal(true)}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="add" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search files..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Folder Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.folderTabs}
      >
        {folders.map(renderFolderTab)}
      </ScrollView>

      {/* Files List */}
      <View style={styles.content}>
        {filteredFiles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No files found</Text>
            <Text style={styles.emptyMessage}>
              {searchQuery ? 'Try a different search term' : 'Upload your first file to get started'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredFiles}
            renderItem={renderFile}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode} // Force re-render when view mode changes
            contentContainerStyle={styles.filesList}
          />
        )}
      </View>

      {/* Upload Modal */}
      <Modal visible={showUploadModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload File</Text>
            
            <TouchableOpacity
              style={styles.uploadOption}
              onPress={() => handleUploadOption('image')}
            >
              <Ionicons name="image" size={24} color="#4CAF50" />
              <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.uploadOption}
              onPress={() => handleUploadOption('camera')}
            >
              <Ionicons name="camera" size={24} color="#2196F3" />
              <Text style={styles.uploadOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.uploadOption}
              onPress={() => handleUploadOption('document')}
            >
              <Ionicons name="document" size={24} color="#FF9800" />
              <Text style={styles.uploadOptionText}>Choose Document</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowUploadModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* File Details Modal */}
      <Modal visible={!!showFileDetails} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {showFileDetails && (
              <>
                <Text style={styles.modalTitle}>{showFileDetails.name}</Text>
                
                <View style={styles.fileDetailContainer}>
                  {showFileDetails.type.startsWith('image/') ? (
                    <Image 
                      source={{ uri: showFileDetails.url }} 
                      style={styles.filePreviewImage} 
                    />
                  ) : (
                    <View style={styles.filePreviewIcon}>
                      <Ionicons 
                        name={getFileTypeIcon(showFileDetails.type) as any} 
                        size={64} 
                        color="#667eea" 
                      />
                    </View>
                  )}
                  
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileDetailLabel}>Size:</Text>
                    <Text style={styles.fileDetailValue}>
                      {formatFileSize(showFileDetails.size)}
                    </Text>
                    
                    <Text style={styles.fileDetailLabel}>Type:</Text>
                    <Text style={styles.fileDetailValue}>
                      {showFileDetails.type}
                    </Text>
                    
                    <Text style={styles.fileDetailLabel}>Uploaded:</Text>
                    <Text style={styles.fileDetailValue}>
                      {showFileDetails.uploadedAt.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.fileActions}>
                  <TouchableOpacity
                    style={[styles.fileActionButton, styles.deleteButton]}
                    onPress={() => {
                      setShowFileDetails(null);
                      handleDeleteFile(showFileDetails);
                    }}
                  >
                    <Ionicons name="trash" size={20} color="#FFFFFF" />
                    <Text style={styles.fileActionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowFileDetails(null)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10
  },
  headerButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16
  },
  folderTabs: {
    paddingHorizontal: 15,
    marginBottom: 10
  },
  folderTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  activeFolderTab: {
    backgroundColor: '#667eea',
    borderColor: '#667eea'
  },
  folderTabText: {
    fontSize: 14,
    color: '#666'
  },
  activeFolderTabText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  content: {
    flex: 1,
    paddingHorizontal: 15
  },
  filesList: {
    paddingBottom: 20
  },
  gridItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  gridItemContent: {
    padding: 15,
    alignItems: 'center'
  },
  gridImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 10
  },
  gridIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  gridFileName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5
  },
  gridFileSize: {
    fontSize: 10,
    color: '#666'
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  },
  listItemIcon: {
    marginRight: 15
  },
  listImage: {
    width: 40,
    height: 40,
    borderRadius: 8
  },
  listItemInfo: {
    flex: 1
  },
  listFileName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2
  },
  listFileDetails: {
    fontSize: 12,
    color: '#666'
  },
  listItemAction: {
    padding: 5
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center'
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  uploadOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12
  },
  fileDetailContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  filePreviewImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 15
  },
  filePreviewIcon: {
    width: 150,
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  fileDetails: {
    width: '100%'
  },
  fileDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 10
  },
  fileDetailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  fileActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  fileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5
  },
  deleteButton: {
    backgroundColor: '#f44336'
  },
  fileActionText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: '600'
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center'
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600'
  }
});

export default React.memo(FileManagerScreen);
