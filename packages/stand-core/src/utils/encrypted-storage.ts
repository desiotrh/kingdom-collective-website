// Encrypted storage utility using Web Crypto API
// Note: This is a web-only implementation. For React Native, use expo-secure-store

export interface EncryptedData {
  iv: string;
  data: string;
  version: string;
}

export interface StorageKey {
  id: string;
  key: CryptoKey;
  createdAt: string;
}

export class EncryptedStorage {
  private static instance: EncryptedStorage;
  private masterKey: CryptoKey | null = null;
  private storageKeys: Map<string, StorageKey> = new Map();
  private readonly ALGORITHM = 'AES-GCM';
  private readonly KEY_LENGTH = 256;
  private readonly VERSION = '1.0';

  private constructor() {}

  static getInstance(): EncryptedStorage {
    if (!EncryptedStorage.instance) {
      EncryptedStorage.instance = new EncryptedStorage();
    }
    return EncryptedStorage.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Check if we have a stored master key
      const storedMasterKey = localStorage.getItem('ks_master_key');
      if (storedMasterKey) {
        // Import existing master key
        const keyData = JSON.parse(storedMasterKey);
        this.masterKey = await this.importKey(keyData);
      } else {
        // Generate new master key
        this.masterKey = await this.generateMasterKey();
        const exportedKey = await this.exportKey(this.masterKey);
        localStorage.setItem('ks_master_key', JSON.stringify(exportedKey));
      }
    } catch (error) {
      console.error('Failed to initialize encrypted storage:', error);
      throw new Error('Failed to initialize encrypted storage');
    }
  }

  private async generateMasterKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async importKey(keyData: any): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
      'raw',
      new Uint8Array(keyData),
      this.ALGORITHM,
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async exportKey(key: CryptoKey): Promise<ArrayBuffer> {
    return await crypto.subtle.exportKey('raw', key);
  }

  async encrypt(data: any): Promise<EncryptedData> {
    if (!this.masterKey) {
      throw new Error('Encrypted storage not initialized');
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const jsonString = JSON.stringify(data);
    const textEncoder = new TextEncoder();
    const encodedData = textEncoder.encode(jsonString);

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv: iv,
      },
      this.masterKey,
      encodedData
    );

    return {
      iv: this.arrayBufferToBase64(iv),
      data: this.arrayBufferToBase64(encryptedBuffer),
      version: this.VERSION,
    };
  }

  async decrypt(encryptedData: EncryptedData): Promise<any> {
    if (!this.masterKey) {
      throw new Error('Encrypted storage not initialized');
    }

    if (encryptedData.version !== this.VERSION) {
      throw new Error('Unsupported data version');
    }

    const iv = this.base64ToArrayBuffer(encryptedData.iv);
    const encryptedBuffer = this.base64ToArrayBuffer(encryptedData.data);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv: iv,
      },
      this.masterKey,
      encryptedBuffer
    );

    const textDecoder = new TextDecoder();
    const jsonString = textDecoder.decode(decryptedBuffer);
    return JSON.parse(jsonString);
  }

  async store(key: string, data: any): Promise<void> {
    const encrypted = await this.encrypt(data);
    localStorage.setItem(`ks_encrypted_${key}`, JSON.stringify(encrypted));
  }

  async retrieve(key: string): Promise<any | null> {
    try {
      const encrypted = localStorage.getItem(`ks_encrypted_${key}`);
      if (!encrypted) return null;

      const encryptedData = JSON.parse(encrypted);
      return await this.decrypt(encryptedData);
    } catch (error) {
      console.error(`Failed to retrieve encrypted data for key ${key}:`, error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(`ks_encrypted_${key}`);
  }

  async clear(): Promise<void> {
    // Remove all encrypted data but keep master key
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('ks_encrypted_')) {
        localStorage.removeItem(key);
      }
    });
  }

  async destroy(): Promise<void> {
    // Remove everything including master key
    await this.clear();
    localStorage.removeItem('ks_master_key');
    this.masterKey = null;
    this.storageKeys.clear();
  }

  // Utility methods for base64 conversion
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Health check method
  async isHealthy(): Promise<boolean> {
    try {
      if (!this.masterKey) return false;
      
      // Test encryption/decryption
      const testData = { test: 'data', timestamp: Date.now() };
      const encrypted = await this.encrypt(testData);
      const decrypted = await this.decrypt(encrypted);
      
      return decrypted.test === testData.test;
    } catch (error) {
      return false;
    }
  }

  // Get storage statistics
  getStorageStats(): { totalKeys: number; totalSize: number } {
    let totalSize = 0;
    let totalKeys = 0;

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('ks_encrypted_')) {
        totalKeys++;
        totalSize += localStorage.getItem(key)?.length || 0;
      }
    });

    return { totalKeys, totalSize };
  }
}

// Export singleton instance
export const encryptedStorage = EncryptedStorage.getInstance();

// Convenience functions
export async function storeEncrypted(key: string, data: any): Promise<void> {
  return await encryptedStorage.store(key, data);
}

export async function retrieveEncrypted(key: string): Promise<any | null> {
  return await encryptedStorage.retrieve(key);
}

export async function removeEncrypted(key: string): Promise<void> {
  return await encryptedStorage.remove(key);
}

export async function clearEncryptedStorage(): Promise<void> {
  return await encryptedStorage.clear();
}
