const { MongoClient } = require('mongodb');

class DatabaseOptimizer {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.client = null;
  }

  async connect() {
    this.client = new MongoClient(this.connectionString, {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    await this.client.connect();
  }

  async createOptimalIndexes() {
    const db = this.client.db();
    
    console.log('Creating optimized indexes...');

    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ createdAt: 1 });
    await db.collection('users').createIndex({ lastLogin: 1 });

    // Content collection indexes
    await db.collection('content').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('content').createIndex({ platform: 1, contentType: 1 });
    await db.collection('content').createIndex({ tags: 1 });
    await db.collection('content').createIndex({ 
      title: 'text', 
      content: 'text' 
    });

    // Templates collection indexes
    await db.collection('templates').createIndex({ category: 1, platform: 1 });
    await db.collection('templates').createIndex({ popularity: -1 });
    await db.collection('templates').createIndex({ tags: 1 });

    // Favorites collection indexes
    await db.collection('favorites').createIndex({ userId: 1, contentId: 1 }, { unique: true });
    await db.collection('favorites').createIndex({ userId: 1, createdAt: -1 });

    console.log('✅ All indexes created successfully');
  }

  async optimizeQueries() {
    const db = this.client.db();
    
    // Add query optimization hints
    console.log('Setting up query optimization...');

    // Create aggregation pipelines for common queries
    const pipelines = {
      userContentSummary: [
        { $match: { userId: '{{userId}}' } },
        { $group: {
          _id: '$platform',
          count: { $sum: 1 },
          lastCreated: { $max: '$createdAt' }
        }},
        { $sort: { count: -1 } }
      ],
      
      popularTemplates: [
        { $group: {
          _id: '$templateId',
          usageCount: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }},
        { $sort: { usageCount: -1 } },
        { $limit: 20 }
      ]
    };

    // Store optimized queries as views
    for (const [name, pipeline] of Object.entries(pipelines)) {
      try {
        await db.createCollection(name, {
          viewOn: 'content',
          pipeline: pipeline
        });
      } catch (error) {
        // View might already exist
        console.log(`View ${name} already exists or error: ${error.message}`);
      }
    }

    console.log('✅ Query optimization completed');
  }

  async setupCaching() {
    console.log('Setting up database-level caching...');
    
    // MongoDB change streams for cache invalidation
    const db = this.client.db();
    
    const changeStream = db.watch([
      { $match: { 
        'fullDocument.collection': { $in: ['templates', 'content'] }
      }}
    ]);

    changeStream.on('change', (change) => {
      console.log(`Cache invalidation trigger: ${change.operationType} on ${change.ns.coll}`);
      // Trigger cache invalidation in your cache service
    });

    console.log('✅ Database caching and change streams setup');
  }

  async getPerformanceStats() {
    const db = this.client.db();
    const admin = db.admin();
    
    const stats = await admin.serverStatus();
    const dbStats = await db.stats();
    
    return {
      connections: stats.connections,
      memory: stats.mem,
      operations: stats.opcounters,
      dbSize: dbStats.dataSize,
      indexSize: dbStats.indexSize,
    };
  }

  async close() {
    if (this.client) {
      await this.client.close();
    }
  }
}

module.exports = DatabaseOptimizer;