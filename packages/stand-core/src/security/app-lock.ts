export interface AppLockConfig {
  enabled: boolean;
  lockType: 'passcode' | 'biometric' | 'both';
  passcodeLength: number;
  biometricTypes: BiometricType[];
  lockTimeout: number; // in minutes
  maxAttempts: number;
  requireLockOnAppStart: boolean;
  requireLockOnResume: boolean;
}

export type BiometricType = 'fingerprint' | 'face' | 'iris';

export interface AppLockState {
  isLocked: boolean;
  lockType: 'passcode' | 'biometric' | 'both';
  lastUnlockTime?: string;
  failedAttempts: number;
  lockedUntil?: string; // ISO timestamp for temporary lockout
}

export interface AppLockService {
  // Configuration
  configure(config: AppLockConfig): Promise<void>;
  getConfig(): AppLockConfig;
  
  // Lock management
  lock(): Promise<void>;
  unlock(passcode?: string): Promise<boolean>;
  isLocked(): boolean;
  getLockState(): AppLockState;
  
  // Biometric authentication
  isBiometricAvailable(): Promise<boolean>;
  authenticateBiometric(): Promise<boolean>;
  
  // Passcode management
  setPasscode(passcode: string): Promise<void>;
  verifyPasscode(passcode: string): Promise<boolean>;
  changePasscode(oldPasscode: string, newPasscode: string): Promise<boolean>;
  
  // Security
  getFailedAttempts(): number;
  isTemporarilyLocked(): boolean;
  resetFailedAttempts(): void;
}

// Default app lock configuration
export const DEFAULT_APP_LOCK_CONFIG: AppLockConfig = {
  enabled: true,
  lockType: 'both',
  passcodeLength: 6,
  biometricTypes: ['fingerprint', 'face'],
  lockTimeout: 5, // 5 minutes
  maxAttempts: 5,
  requireLockOnAppStart: true,
  requireLockOnResume: true
};

// App lock service implementation
export class AppLockService implements AppLockService {
  private static instance: AppLockService;
  private config: AppLockConfig;
  private state: AppLockState;
  private passcodeHash: string | null = null;
  private lockTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = { ...DEFAULT_APP_LOCK_CONFIG };
    this.state = {
      isLocked: true,
      lockType: this.config.lockType,
      failedAttempts: 0
    };
  }

  static getInstance(): AppLockService {
    if (!AppLockService.instance) {
      AppLockService.instance = new AppLockService();
    }
    return AppLockService.instance;
  }

  async configure(config: AppLockConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    this.state.lockType = this.config.lockType;
    
    // Save configuration to secure storage
    await this.saveConfig();
  }

  getConfig(): AppLockConfig {
    return { ...this.config };
  }

  async lock(): Promise<void> {
    this.state.isLocked = true;
    this.state.lastUnlockTime = undefined;
    
    // Clear any existing lock timer
    if (this.lockTimer) {
      clearTimeout(this.lockTimer);
      this.lockTimer = null;
    }
    
    // Save lock state
    await this.saveLockState();
  }

  async unlock(passcode?: string): Promise<boolean> {
    if (!this.state.isLocked) {
      return true;
    }

    // Check if temporarily locked
    if (this.isTemporarilyLocked()) {
      return false;
    }

    let unlocked = false;

    // Try biometric authentication first if available and enabled
    if (this.config.lockType !== 'passcode' && await this.isBiometricAvailable()) {
      try {
        unlocked = await this.authenticateBiometric();
      } catch (error) {
        console.warn('Biometric authentication failed:', error);
      }
    }

    // Try passcode if biometric failed or not available
    if (!unlocked && passcode && this.config.lockType !== 'biometric') {
      unlocked = await this.verifyPasscode(passcode);
    }

    if (unlocked) {
      // Success - unlock the app
      this.state.isLocked = false;
      this.state.lastUnlockTime = new Date().toISOString();
      this.state.failedAttempts = 0;
      this.state.lockedUntil = undefined;
      
      // Set auto-lock timer
      this.setAutoLockTimer();
      
      // Save lock state
      await this.saveLockState();
      
      return true;
    } else {
      // Failed attempt
      this.state.failedAttempts++;
      
      // Check if we should temporarily lock the app
      if (this.state.failedAttempts >= this.config.maxAttempts) {
        const lockoutDuration = Math.min(30 * Math.pow(2, this.state.failedAttempts - this.config.maxAttempts), 1440); // Max 24 hours
        this.state.lockedUntil = new Date(Date.now() + lockoutDuration * 60000).toISOString();
      }
      
      // Save lock state
      await this.saveLockState();
      
      return false;
    }
  }

  isLocked(): boolean {
    return this.state.isLocked;
  }

  getLockState(): AppLockState {
    return { ...this.state };
  }

  async isBiometricAvailable(): Promise<boolean> {
    // This is a placeholder implementation
    // In a real app, you would check device capabilities
    // For now, we'll simulate biometric availability
    return this.config.biometricTypes.length > 0;
  }

  async authenticateBiometric(): Promise<boolean> {
    // This is a placeholder implementation
    // In a real app, you would integrate with device biometric APIs
    // For now, we'll simulate successful authentication
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  async setPasscode(passcode: string): Promise<void> {
    if (passcode.length !== this.config.passcodeLength) {
      throw new Error(`Passcode must be exactly ${this.config.passcodeLength} characters`);
    }

    // Hash the passcode (in a real app, use proper cryptographic hashing)
    this.passcodeHash = await this.hashPasscode(passcode);
    
    // Save to secure storage
    await this.savePasscodeHash();
  }

  async verifyPasscode(passcode: string): Promise<boolean> {
    if (!this.passcodeHash) {
      return false;
    }

    const hashedInput = await this.hashPasscode(passcode);
    return this.passcodeHash === hashedInput;
  }

  async changePasscode(oldPasscode: string, newPasscode: string): Promise<boolean> {
    // Verify old passcode first
    if (!(await this.verifyPasscode(oldPasscode))) {
      return false;
    }

    // Set new passcode
    await this.setPasscode(newPasscode);
    return true;
  }

  getFailedAttempts(): number {
    return this.state.failedAttempts;
  }

  isTemporarilyLocked(): boolean {
    if (!this.state.lockedUntil) {
      return false;
    }

    const now = new Date();
    const lockedUntil = new Date(this.state.lockedUntil);
    
    if (now < lockedUntil) {
      return true;
    } else {
      // Lockout period expired
      this.state.lockedUntil = undefined;
      return false;
    }
  }

  resetFailedAttempts(): void {
    this.state.failedAttempts = 0;
    this.state.lockedUntil = undefined;
  }

  private setAutoLockTimer(): void {
    if (this.config.lockTimeout <= 0) {
      return;
    }

    // Clear any existing timer
    if (this.lockTimer) {
      clearTimeout(this.lockTimer);
    }

    // Set new timer
    this.lockTimer = setTimeout(async () => {
      await this.lock();
    }, this.config.lockTimeout * 60000);
  }

  private async hashPasscode(passcode: string): Promise<string> {
    // This is a placeholder implementation
    // In a real app, use proper cryptographic hashing (e.g., bcrypt, Argon2)
    const encoder = new TextEncoder();
    const data = encoder.encode(passcode);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async saveConfig(): Promise<void> {
    // Save configuration to secure storage
    // This is a placeholder - implement actual storage
    console.log('Saving app lock config:', this.config);
  }

  private async saveLockState(): Promise<void> {
    // Save lock state to secure storage
    // This is a placeholder - implement actual storage
    console.log('Saving lock state:', this.state);
  }

  private async savePasscodeHash(): Promise<void> {
    // Save passcode hash to secure storage
    // This is a placeholder - implement actual storage
    console.log('Saving passcode hash');
  }

  // Public method to check if app should be locked on resume
  shouldLockOnResume(): boolean {
    if (!this.config.requireLockOnResume) {
      return false;
    }

    if (!this.state.lastUnlockTime) {
      return true;
    }

    const lastUnlock = new Date(this.state.lastUnlockTime);
    const now = new Date();
    const timeSinceUnlock = (now.getTime() - lastUnlock.getTime()) / 60000; // in minutes

    return timeSinceUnlock >= this.config.lockTimeout;
  }

  // Public method to check if app should be locked on start
  shouldLockOnStart(): boolean {
    return this.config.requireLockOnAppStart;
  }
}

// Export singleton instance
export const appLockService = AppLockService.getInstance();

// Convenience functions
export function isAppLocked(): boolean {
  return appLockService.isLocked();
}

export function shouldLockOnResume(): boolean {
  return appLockService.shouldLockOnResume();
}

export function shouldLockOnStart(): boolean {
  return appLockService.shouldLockOnStart();
}
