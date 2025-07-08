import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MockDB, isMockMode } from '../config/database.js';

// Original Mongoose Schema (for when MongoDB is available)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  profile: {
    faithMode: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },
    preferences: {
      contentFiltering: {
        type: Boolean,
        default: true
      },
      emailNotifications: {
        type: Boolean,
        default: true
      },
      pushNotifications: {
        type: Boolean,
        default: true
      },
      marketingEmails: {
        type: Boolean,
        default: false
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto'
      },
      language: {
        type: String,
        default: 'en'
      }
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'past_due'],
      default: 'active'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    }
  },
  usage: {
    contentGenerations: {
      type: Number,
      default: 0
    },
    apiCalls: {
      type: Number,
      default: 0
    },
    storageUsed: {
      type: Number,
      default: 0
    },
    monthlyReset: {
      type: Date,
      default: Date.now
    }
  },
  security: {
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: String
  },
  metadata: {
    lastLoginAt: Date,
    lastLoginIP: String,
    loginCount: {
      type: Number,
      default: 0
    },
    referralSource: String,
    utmData: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ 'subscription.stripeCustomerId': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'metadata.lastLoginAt': -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (isMockMode()) {
    // Simple comparison for mock mode (passwords are already hashed in mock)
    return bcrypt.compare(candidatePassword, this.password);
  }
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementUsage = function(type, amount = 1) {
  if (!this.usage[type]) this.usage[type] = 0;
  this.usage[type] += amount;
  return this.save();
};

userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.security.twoFactorSecret;
  delete obj.security.emailVerificationToken;
  delete obj.security.passwordResetToken;
  return obj;
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  if (isMockMode()) {
    return Promise.resolve(MockDB.users.findOne({ email }));
  }
  return this.findOne({ email });
};

// Mock-aware User class that works with both MongoDB and mock database
class UserModel {
  constructor(data) {
    if (isMockMode()) {
      // Mock mode - store data directly
      Object.assign(this, data);
      this._id = this._id || Date.now().toString();
      this.createdAt = this.createdAt || new Date();
      this.updatedAt = new Date();
    } else {
      // MongoDB mode - return actual Mongoose model
      return new MongoUser(data);
    }
  }

  static async create(userData) {
    if (isMockMode()) {
      const user = MockDB.users.create(userData);
      return new UserModel(user);
    } else {
      const mongoUser = new MongoUser(userData);
      await mongoUser.save();
      return mongoUser;
    }
  }

  static async findOne(query) {
    if (isMockMode()) {
      const user = MockDB.users.findOne(query);
      return user ? new UserModel(user) : null;
    } else {
      return await MongoUser.findOne(query);
    }
  }

  static async findById(id) {
    if (isMockMode()) {
      const user = MockDB.users.findById(id);
      return user ? new UserModel(user) : null;
    } else {
      return await MongoUser.findById(id);
    }
  }

  static async findByEmail(email) {
    if (isMockMode()) {
      const user = MockDB.users.findOne({ email });
      return user ? new UserModel(user) : null;
    } else {
      return await MongoUser.findOne({ email });
    }
  }

  async save() {
    if (isMockMode()) {
      this.updatedAt = new Date();
      MockDB.users.updateOne(this._id, this);
      return this;
    } else {
      // This should not be called in mock mode, but handled by Mongoose
      throw new Error('Save method called on mock user - this should not happen');
    }
  }

  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  toSafeObject() {
    const obj = { ...this };
    delete obj.password;
    if (obj.security) {
      delete obj.security.twoFactorSecret;
      delete obj.security.emailVerificationToken;
      delete obj.security.passwordResetToken;
    }
    return obj;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

// Create the actual Mongoose model
const MongoUser = mongoose.model('User', userSchema);

// Export the mock-aware User class
export default UserModel;
