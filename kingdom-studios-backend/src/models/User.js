import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

// User Schema with Kingdom Studios specific fields
const userSchema = new Schema({
  // Basic user information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  // Kingdom Studios specific fields
  faithMode: {
    type: Boolean,
    default: true,
    description: 'Whether user prefers faith-based content and features'
  },
  userType: {
    type: String,
    enum: ['creator', 'business', 'ministry', 'entrepreneur'],
    default: 'creator'
  },
  
  // Subscription information
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise', 'lifetime'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'past_due', 'trialing'],
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
  
  // Platform integrations
  platforms: {
    etsy: {
      connected: { type: Boolean, default: false },
      shopId: String,
      accessToken: String, // encrypted in production
      refreshToken: String, // encrypted in production
      connectedAt: Date
    },
    shopify: {
      connected: { type: Boolean, default: false },
      shopDomain: String,
      accessToken: String, // encrypted in production
      connectedAt: Date
    },
    printify: {
      connected: { type: Boolean, default: false },
      accessToken: String, // encrypted in production
      connectedAt: Date
    },
    amazon: {
      connected: { type: Boolean, default: false },
      sellerId: String,
      marketplaceId: String,
      connectedAt: Date
    }
  },
  
  // Usage tracking
  usage: {
    contentGenerated: {
      type: Number,
      default: 0
    },
    productsCreated: {
      type: Number,
      default: 0
    },
    productsSynced: {
      type: Number,
      default: 0
    },
    lastContentGeneration: Date,
    lastLogin: Date,
    totalSessions: {
      type: Number,
      default: 0
    }
  },
  
  // Preferences
  preferences: {
    defaultPlatform: String,
    contentStyle: {
      type: String,
      enum: ['casual', 'professional', 'inspirational', 'educational'],
      default: 'inspirational'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    analytics: {
      shareData: { type: Boolean, default: true },
      improveService: { type: Boolean, default: true }
    }
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Metadata
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String,
  
}, {
  timestamps: true, // adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.passwordResetToken;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ 'subscription.stripeCustomerId': 1 });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastActiveAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to update last active time
userSchema.methods.updateLastActive = function() {
  this.lastActiveAt = new Date();
  this.usage.totalSessions += 1;
  return this.save();
};

// Method to increment usage counters
userSchema.methods.incrementUsage = function(type) {
  if (this.usage[type] !== undefined) {
    this.usage[type] += 1;
    
    // Update last activity timestamps
    if (type === 'contentGenerated') {
      this.usage.lastContentGeneration = new Date();
    }
  }
  return this.save();
};

// Method to check subscription status
userSchema.methods.hasActiveSubscription = function() {
  return this.subscription.status === 'active' && 
         this.subscription.plan !== 'free';
};

// Method to check feature access
userSchema.methods.canAccessFeature = function(feature) {
  const plan = this.subscription.plan;
  
  const featureAccess = {
    free: ['basic_content', 'limited_analytics'],
    pro: ['basic_content', 'advanced_content', 'platform_sync', 'analytics', 'priority_support'],
    enterprise: ['all_features', 'custom_integrations', 'dedicated_support', 'custom_branding'],
    lifetime: ['all_features', 'custom_integrations', 'dedicated_support']
  };
  
  return featureAccess[plan]?.includes(feature) || featureAccess[plan]?.includes('all_features');
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to get user statistics
userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [
              { $gte: ['$lastActiveAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
              1,
              0
            ]
          }
        },
        paidUsers: {
          $sum: {
            $cond: [
              { $ne: ['$subscription.plan', 'free'] },
              1,
              0
            ]
          }
        },
        faithModeUsers: {
          $sum: {
            $cond: ['$faithMode', 1, 0]
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    paidUsers: 0,
    faithModeUsers: 0
  };
};

const User = mongoose.model('User', userSchema);

export default User;
