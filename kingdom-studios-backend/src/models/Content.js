import mongoose from 'mongoose';

const { Schema } = mongoose;

// Generated Content Schema
const contentSchema = new Schema({
  // Basic content information
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Content details
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'email', 'social_post', 'blog_post', 'product_description'],
    required: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Kingdom Studios specific
  faithMode: {
    type: Boolean,
    default: false
  },
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube', 'etsy', 'shopify', 'email', 'blog', 'general'],
    default: 'general'
  },
  
  // Generation metadata
  metadata: {
    generationMethod: {
      type: String,
      enum: ['openai', 'openrouter', 'claude', 'mock', 'fallback'],
      required: true
    },
    model: String, // e.g., 'gpt-4', 'claude-3-haiku'
    temperature: Number,
    maxTokens: Number,
    processingTime: Number, // milliseconds
    cost: Number, // API cost in cents
    wordCount: Number,
    characterCount: Number,
    language: {
      type: String,
      default: 'en'
    }
  },
  
  // Content analysis
  analysis: {
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral'
    },
    readabilityScore: Number,
    keywords: [String],
    topics: [String],
    faithElements: [String], // biblical references, spiritual themes
    marketingHooks: [String]
  },
  
  // Usage and performance
  usage: {
    views: {
      type: Number,
      default: 0
    },
    copies: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    exports: {
      type: Number,
      default: 0
    },
    lastAccessed: Date
  },
  
  // Publishing status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'deleted'],
    default: 'draft'
  },
  publishedTo: [{
    platform: String,
    publishedAt: Date,
    platformId: String, // ID on the target platform
    performanceData: Schema.Types.Mixed
  }],
  
  // Organization
  tags: [String],
  category: {
    type: String,
    enum: ['marketing', 'inspirational', 'educational', 'product', 'personal', 'ministry', 'business'],
    default: 'general'
  },
  folder: String,
  
  // Collaboration
  isShared: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'edit', 'admin'],
      default: 'view'
    },
    sharedAt: Date
  }],
  
  // Versioning
  version: {
    type: Number,
    default: 1
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Content'
  },
  variations: [{
    content: String,
    createdAt: Date,
    prompt: String,
    metadata: Schema.Types.Mixed
  }],
  
  // Quality and feedback
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  flagged: {
    type: Boolean,
    default: false
  },
  flagReason: String,
  
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
contentSchema.index({ userId: 1, createdAt: -1 });
contentSchema.index({ type: 1, platform: 1 });
contentSchema.index({ status: 1 });
contentSchema.index({ faithMode: 1 });
contentSchema.index({ 'metadata.generationMethod': 1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ category: 1 });

// Text search index
contentSchema.index({
  title: 'text',
  content: 'text',
  tags: 'text'
});

// Pre-save middleware to analyze content
contentSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Calculate basic metrics
    this.metadata.wordCount = this.content.split(/\s+/).length;
    this.metadata.characterCount = this.content.length;
    
    // Extract keywords (simple implementation)
    const words = this.content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // Get top 10 most frequent words as keywords
    this.analysis.keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
    
    // Detect faith elements (simple implementation)
    const faithKeywords = ['god', 'jesus', 'faith', 'prayer', 'blessing', 'kingdom', 'lord', 'christ', 'spirit', 'grace', 'glory', 'purpose', 'calling', 'ministry'];
    this.analysis.faithElements = faithKeywords.filter(keyword => 
      this.content.toLowerCase().includes(keyword)
    );
  }
  
  next();
});

// Method to increment usage counters
contentSchema.methods.incrementUsage = function(type) {
  if (this.usage[type] !== undefined) {
    this.usage[type] += 1;
    this.usage.lastAccessed = new Date();
  }
  return this.save();
};

// Method to create variation
contentSchema.methods.createVariation = function(newContent, newPrompt, metadata = {}) {
  this.variations.push({
    content: newContent,
    createdAt: new Date(),
    prompt: newPrompt,
    metadata
  });
  this.version += 1;
  return this.save();
};

// Method to publish to platform
contentSchema.methods.publishTo = function(platform, platformId = null, performanceData = {}) {
  this.publishedTo.push({
    platform,
    publishedAt: new Date(),
    platformId,
    performanceData
  });
  
  if (this.status === 'draft') {
    this.status = 'published';
  }
  
  return this.save();
};

// Static method to get content statistics
contentSchema.statics.getContentStats = async function(userId = null) {
  const matchStage = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalContent: { $sum: 1 },
        faithModeContent: {
          $sum: { $cond: ['$faithMode', 1, 0] }
        },
        publishedContent: {
          $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
        },
        totalViews: { $sum: '$usage.views' },
        totalCopies: { $sum: '$usage.copies' },
        avgRating: { $avg: '$rating' },
        contentByType: {
          $push: '$type'
        },
        contentByPlatform: {
          $push: '$platform'
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalContent: 0,
    faithModeContent: 0,
    publishedContent: 0,
    totalViews: 0,
    totalCopies: 0,
    avgRating: 0,
    contentByType: [],
    contentByPlatform: []
  };
};

// Static method to find popular content
contentSchema.statics.findPopular = function(limit = 10, platform = null) {
  const match = platform ? { platform } : {};
  
  return this.find(match)
    .sort({ 'usage.views': -1, 'usage.copies': -1 })
    .limit(limit)
    .populate('userId', 'name faithMode')
    .lean();
};

// Static method to find recent content
contentSchema.statics.findRecent = function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

const Content = mongoose.model('Content', contentSchema);

export default Content;
