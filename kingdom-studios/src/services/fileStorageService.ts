import { uploadBytes, getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export interface FileUploadOptions {
  folder?: string;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  generateThumbnail?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
  folder: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
}

export interface FileUploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

class FileStorageService {
  private static instance: FileStorageService;
  
  private uploadProgress: Map<string, FileUploadProgress> = new Map();
  private uploadListeners: Map<string, (progress: FileUploadProgress) => void> = new Map();

  public static getInstance(): FileStorageService {
    if (!FileStorageService.instance) {
      FileStorageService.instance = new FileStorageService();
    }
    return FileStorageService.instance;
  }

  // Generate unique file ID
  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Validate file before upload
  private validateFile(file: any, options: FileUploadOptions): boolean {
    const { maxSizeBytes = 10 * 1024 * 1024, allowedTypes = [] } = options; // Default 10MB

    if (file.size > maxSizeBytes) {
      throw new Error(`File size exceeds limit of ${maxSizeBytes / (1024 * 1024)}MB`);
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimeType || file.type)) {
      throw new Error(`File type ${file.mimeType || file.type} is not allowed`);
    }

    return true;
  }

  // Upload file to Firebase Storage
  async uploadFile(
    file: any, 
    options: FileUploadOptions = {}
  ): Promise<UploadedFile> {
    const fileId = this.generateFileId();
    const { folder = 'uploads' } = options;

    try {
      // Validate file
      this.validateFile(file, options);

      // Create progress tracker
      const progressTracker: FileUploadProgress = {
        fileId,
        progress: 0,
        status: 'uploading'
      };
      
      this.uploadProgress.set(fileId, progressTracker);
      this.notifyProgressListeners(fileId, progressTracker);

      // Create storage reference
      const fileName = `${fileId}_${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      // Upload file
      const uploadTask = uploadBytes(storageRef, file);

      // Update progress (simplified for demo)
      setTimeout(() => {
        const updatedProgress = { ...progressTracker, progress: 50 };
        this.uploadProgress.set(fileId, updatedProgress);
        this.notifyProgressListeners(fileId, updatedProgress);
      }, 1000);

      await uploadTask;

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Final progress update
      const completedProgress: FileUploadProgress = {
        fileId,
        progress: 100,
        status: 'completed'
      };
      
      this.uploadProgress.set(fileId, completedProgress);
      this.notifyProgressListeners(fileId, completedProgress);

      // Create uploaded file record
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        url: downloadURL,
        size: file.size,
        type: file.mimeType || file.type,
        uploadedAt: new Date(),
        folder,
        metadata: {
          originalName: file.name,
          uploadMethod: 'firebase_storage'
        }
      };

      // Generate thumbnail for images
      if (options.generateThumbnail && this.isImageFile(file)) {
        uploadedFile.thumbnailUrl = await this.generateThumbnail(downloadURL);
      }

      return uploadedFile;

    } catch (error) {
      const errorProgress: FileUploadProgress = {
        fileId,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      };
      
      this.uploadProgress.set(fileId, errorProgress);
      this.notifyProgressListeners(fileId, errorProgress);
      
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: any[], 
    options: FileUploadOptions = {}
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }

  // Delete file from storage
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  // Pick image from device
  async pickImage(options: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  } = {}): Promise<any> {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        throw new Error('Permission to access camera roll is required!');
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options.allowsEditing || true,
        aspect: options.aspect || [4, 3],
        quality: options.quality || 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Convert to file-like object
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        
        return {
          name: `image_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: blob.size,
          uri: asset.uri,
          ...blob
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  }

  // Take photo with camera
  async takePhoto(options: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  } = {}): Promise<any> {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        throw new Error('Permission to access camera is required!');
      }

      // Take photo
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: options.allowsEditing || true,
        aspect: options.aspect || [4, 3],
        quality: options.quality || 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Convert to file-like object
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        
        return {
          name: `photo_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: blob.size,
          uri: asset.uri,
          ...blob
        };
      }

      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  // Pick document from device
  async pickDocument(options: {
    type?: string[];
    copyToCacheDirectory?: boolean;
  } = {}): Promise<any> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: options.type || ['*/*'],
        copyToCacheDirectory: options.copyToCacheDirectory || true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        return {
          name: asset.name,
          type: asset.mimeType,
          size: asset.size,
          uri: asset.uri
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking document:', error);
      throw error;
    }
  }

  // Check if file is image
  private isImageFile(file: any): boolean {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(file.mimeType || file.type);
  }

  // Generate thumbnail (simplified - would use actual image processing in production)
  private async generateThumbnail(imageUrl: string): Promise<string> {
    // In a real implementation, you would:
    // 1. Download the image
    // 2. Resize it to thumbnail size
    // 3. Upload the thumbnail to storage
    // 4. Return the thumbnail URL
    
    // For now, return the original URL as thumbnail
    return imageUrl;
  }

  // Upload progress management
  onUploadProgress(fileId: string, callback: (progress: FileUploadProgress) => void): void {
    this.uploadListeners.set(fileId, callback);
  }

  removeUploadListener(fileId: string): void {
    this.uploadListeners.delete(fileId);
  }

  private notifyProgressListeners(fileId: string, progress: FileUploadProgress): void {
    const listener = this.uploadListeners.get(fileId);
    if (listener) {
      listener(progress);
    }
  }

  getUploadProgress(fileId: string): FileUploadProgress | null {
    return this.uploadProgress.get(fileId) || null;
  }

  // Get file type icon
  getFileTypeIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'videocam';
    if (fileType.startsWith('audio/')) return 'musical-notes';
    if (fileType.includes('pdf')) return 'document-text';
    if (fileType.includes('word') || fileType.includes('doc')) return 'document-text';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'grid';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'easel';
    return 'document';
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Batch operations
  async uploadBatch(
    files: any[], 
    options: FileUploadOptions = {},
    onProgress?: (completed: number, total: number) => void
  ): Promise<UploadedFile[]> {
    const results: UploadedFile[] = [];
    let completed = 0;

    for (const file of files) {
      try {
        const uploadedFile = await this.uploadFile(file, options);
        results.push(uploadedFile);
        completed++;
        
        if (onProgress) {
          onProgress(completed, files.length);
        }
      } catch (error) {
        console.error(`Failed to upload file ${file.name}:`, error);
        // Continue with other files
      }
    }

    return results;
  }
}

export default FileStorageService.getInstance();
