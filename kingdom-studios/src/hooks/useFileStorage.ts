import { useState, useCallback } from 'react';
import fileStorageService, { 
  type UploadedFile, 
  type FileUploadOptions, 
  type FileUploadProgress 
} from '../services/fileStorageService';

export interface UseFileStorageReturn {
  // State
  uploadedFiles: UploadedFile[];
  isUploading: boolean;
  uploadProgress: Record<string, FileUploadProgress>;
  error: string | null;
  
  // File Operations
  uploadFile: (file: any, options?: FileUploadOptions) => Promise<UploadedFile | null>;
  uploadMultipleFiles: (files: any[], options?: FileUploadOptions) => Promise<UploadedFile[]>;
  deleteFile: (fileUrl: string) => Promise<void>;
  
  // Device File Pickers
  pickImage: (options?: any) => Promise<any>;
  takePhoto: (options?: any) => Promise<any>;
  pickDocument: (options?: any) => Promise<any>;
  
  // Utilities
  formatFileSize: (bytes: number) => string;
  getFileTypeIcon: (fileType: string) => string;
  clearError: () => void;
  clearFiles: () => void;
}

export const useFileStorage = (): UseFileStorageReturn => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, FileUploadProgress>>({});
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    file: any, 
    options: FileUploadOptions = {}
  ): Promise<UploadedFile | null> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const uploadedFile = await fileStorageService.uploadFile(file, options);
      
      setUploadedFiles(prev => [...prev, uploadedFile]);
      
      return uploadedFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadMultipleFiles = useCallback(async (
    files: any[], 
    options: FileUploadOptions = {}
  ): Promise<UploadedFile[]> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const uploadedFiles = await fileStorageService.uploadMultipleFiles(files, options);
      
      setUploadedFiles(prev => [...prev, ...uploadedFiles]);
      
      return uploadedFiles;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return [];
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteFile = useCallback(async (fileUrl: string): Promise<void> => {
    try {
      await fileStorageService.deleteFile(fileUrl);
      
      setUploadedFiles(prev => prev.filter(file => file.url !== fileUrl));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
    }
  }, []);

  const pickImage = useCallback(async (options: any = {}): Promise<any> => {
    try {
      setError(null);
      return await fileStorageService.pickImage(options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pick image';
      setError(errorMessage);
      return null;
    }
  }, []);

  const takePhoto = useCallback(async (options: any = {}): Promise<any> => {
    try {
      setError(null);
      return await fileStorageService.takePhoto(options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to take photo';
      setError(errorMessage);
      return null;
    }
  }, []);

  const pickDocument = useCallback(async (options: any = {}): Promise<any> => {
    try {
      setError(null);
      return await fileStorageService.pickDocument(options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pick document';
      setError(errorMessage);
      return null;
    }
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    return fileStorageService.formatFileSize(bytes);
  }, []);

  const getFileTypeIcon = useCallback((fileType: string): string => {
    return fileStorageService.getFileTypeIcon(fileType);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    // State
    uploadedFiles,
    isUploading,
    uploadProgress,
    error,
    
    // File Operations
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    
    // Device File Pickers
    pickImage,
    takePhoto,
    pickDocument,
    
    // Utilities
    formatFileSize,
    getFileTypeIcon,
    clearError,
    clearFiles
  };
};
