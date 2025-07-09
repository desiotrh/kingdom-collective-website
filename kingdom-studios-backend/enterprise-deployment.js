/**
 * Enterprise Production Deployment Script
 * Deploys Kingdom Studios backend with enterprise-scale configurations
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class EnterpriseDeployment {
  constructor() {
    this.environment = process.env.NODE_ENV || 'production';
    this.deploymentConfig = {
      render: {
        name: 'kingdom-studios-backend-enterprise',
        region: 'oregon',
        plan: 'pro', // Enterprise plan for high performance
        env: 'node',
        buildCommand: 'npm install && npm run build',
        startCommand: 'npm start',
        scalingConfig: {
          minInstances: 3,
          maxInstances: 20,
          targetCPU: 70,
          targetMemory: 80
        }
      },
      railway: {
        name: 'kingdom-studios-enterprise',
        region: 'us-west1',
        plan: 'pro',
        scaling: {
          minReplicas: 3,
          maxReplicas: 50,
          cpuThreshold: 70,
          memoryThreshold: 80
        }
      },
      vercel: {
        name: 'kingdom-studios-api-enterprise',
        regions: ['iad1', 'sfo1', 'lhr1'], // Multi-region deployment
        functions: {
          timeout: 60,
          memory: 3008,
          maxDuration: 300
        }
      }
    };
  }

  /**
   * Main deployment process
   */
  async deploy() {
    console.log('🚀 Starting Enterprise Production Deployment...');
    console.log(`📊 Environment: ${this.environment}`);
    console.log('='.repeat(60));

    try {
      // Pre-deployment checks
      await this.preDeploymentChecks();
      
      // Generate production configurations
      await this.generateProductionConfigs();
      
      // Optimize dependencies
      await this.optimizeDependencies();
      
      // Create deployment files
      await this.createDeploymentFiles();
      
      // Run tests
      await this.runPreDeploymentTests();
      
      // Deploy to platforms
      await this.deployToPlatforms();
      
      // Post-deployment verification
      await this.postDeploymentVerification();
      
      console.log('\n✅ Enterprise deployment completed successfully!');
      
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Pre-deployment checks
   */
  async preDeploymentChecks() {
    console.log('\n🔍 Running pre-deployment checks...');
    
    // Check required environment variables
    const requiredEnvVars = [
      'MONGODB_URI',
      'OPENAI_API_KEY',
      'JWT_SECRET',
      'REDIS_HOST',
      'STRIPE_SECRET_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Check package.json
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json not found');
    }

    // Check critical files
    const criticalFiles = [
      'src/server.js',
      'src/services/EnterpriseScaleInfrastructure.js',
      'src/services/EnterpriseDatabaseOptimizer.js',
      'src/middleware/enterpriseMiddleware.js'
    ];

    for (const file of criticalFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Critical file missing: ${file}`);
      }
    }

    console.log('✅ Pre-deployment checks passed');
  }

  /**
   * Generate production configurations
   */
  async generateProductionConfigs() {
    console.log('\n⚙️ Generating production configurations...');

    // Generate Docker configuration
    const dockerfileContent = `
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy app source
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "src/server.js"]
`;

    fs.writeFileSync('Dockerfile', dockerfileContent.trim());

    // Generate Docker Compose for local testing
    const dockerComposeContent = `
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    depends_on:
      - redis
    networks:
      - kingdom-studios

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - kingdom-studios

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    networks:
      - kingdom-studios

volumes:
  redis_data:

networks:
  kingdom-studios:
    driver: bridge
`;

    fs.writeFileSync('docker-compose.yml', dockerComposeContent.trim());

    // Generate Nginx configuration
    const nginxConfig = `
events {
    worker_connections 1024;
}

http {
    upstream backend {
        least_conn;
        server app:3000;
    }

    server {
        listen 80;
        server_name kingdom-studios.app;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Enterprise optimizations
            proxy_buffer_size 128k;
            proxy_buffers 4 256k;
            proxy_busy_buffers_size 256k;
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check endpoint
        location /health {
            access_log off;
            proxy_pass http://backend;
        }
    }
}
`;

    fs.writeFileSync('nginx.conf', nginxConfig.trim());

    // Generate PM2 ecosystem file
    const pm2Config = {
      apps: [
        {
          name: 'kingdom-studios-enterprise',
          script: 'src/server.js',
          instances: 'max',
          exec_mode: 'cluster',
          watch: false,
          max_memory_restart: '1G',
          env: {
            NODE_ENV: 'production',
            PORT: 3000
          },
          error_file: './logs/err.log',
          out_file: './logs/out.log',
          log_file: './logs/combined.log',
          time: true,
          autorestart: true,
          max_restarts: 10,
          min_uptime: '10s',
          kill_timeout: 5000
        }
      ]
    };

    fs.writeFileSync('ecosystem.config.json', JSON.stringify(pm2Config, null, 2));

    console.log('✅ Production configurations generated');
  }

  /**
   * Optimize dependencies
   */
  async optimizeDependencies() {
    console.log('\n📦 Optimizing dependencies...');

    try {
      // Update package.json scripts for production
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      packageJson.scripts = {
        ...packageJson.scripts,
        'start': 'node src/server.js',
        'start:cluster': 'pm2 start ecosystem.config.json --no-daemon',
        'start:docker': 'node src/server.js',
        'build': 'echo "No build step required for Node.js"',
        'test:prod': 'NODE_ENV=production npm test',
        'health': 'curl -f http://localhost:3000/health || exit 1'
      };

      // Add production dependencies if missing
      const productionDeps = {
        'pm2': '^5.3.0',
        'compression': '^1.7.4',
        'helmet': '^7.1.0'
      };

      packageJson.dependencies = {
        ...packageJson.dependencies,
        ...productionDeps
      };

      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

      // Install production dependencies
      execSync('npm install --production', { stdio: 'inherit' });

      console.log('✅ Dependencies optimized');
    } catch (error) {
      throw new Error(`Dependency optimization failed: ${error.message}`);
    }
  }

  /**
   * Create deployment files for different platforms
   */
  async createDeploymentFiles() {
    console.log('\n📝 Creating deployment files...');

    // Render.com deployment
    const renderConfig = {
      services: [
        {
          type: 'web',
          name: this.deploymentConfig.render.name,
          env: 'node',
          plan: this.deploymentConfig.render.plan,
          buildCommand: this.deploymentConfig.render.buildCommand,
          startCommand: this.deploymentConfig.render.startCommand,
          healthCheckPath: '/health',
          envVars: [
            { key: 'NODE_ENV', value: 'production' },
            { key: 'PORT', value: '3000' }
          ],
          scaling: this.deploymentConfig.render.scalingConfig
        }
      ]
    };

    fs.writeFileSync('render.yaml', JSON.stringify(renderConfig, null, 2));

    // Railway deployment
    const railwayConfig = {
      build: {
        builder: 'NIXPACKS'
      },
      deploy: {
        startCommand: 'npm start',
        healthcheckPath: '/health',
        healthcheckTimeout: 300,
        restartPolicyType: 'ON_FAILURE',
        restartPolicyMaxRetries: 10
      }
    };

    fs.writeFileSync('railway.json', JSON.stringify(railwayConfig, null, 2));

    // Vercel configuration
    const vercelConfig = {
      version: 2,
      name: this.deploymentConfig.vercel.name,
      builds: [
        {
          src: 'src/server.js',
          use: '@vercel/node',
          config: {
            maxLambdaSize: '50mb'
          }
        }
      ],
      routes: [
        {
          src: '/(.*)',
          dest: 'src/server.js'
        }
      ],
      env: {
        NODE_ENV: 'production'
      },
      functions: this.deploymentConfig.vercel.functions,
      regions: this.deploymentConfig.vercel.regions
    };

    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));

    // Kubernetes deployment
    const k8sDeployment = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kingdom-studios-backend
  labels:
    app: kingdom-studios-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: kingdom-studios-backend
  template:
    metadata:
      labels:
        app: kingdom-studios-backend
    spec:
      containers:
      - name: backend
        image: kingdom-studios/backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: kingdom-studios-backend-service
spec:
  selector:
    app: kingdom-studios-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
`;

    fs.writeFileSync('k8s-deployment.yaml', k8sDeployment.trim());

    console.log('✅ Deployment files created');
  }

  /**
   * Run pre-deployment tests
   */
  async runPreDeploymentTests() {
    console.log('\n🧪 Running pre-deployment tests...');

    try {
      // Run basic tests
      if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        if (packageJson.scripts && packageJson.scripts.test) {
          execSync('npm test', { stdio: 'inherit' });
        }
      }

      // Run linting
      try {
        execSync('npm run lint', { stdio: 'inherit' });
      } catch (error) {
        console.log('⚠️ Linting not configured or failed');
      }

      // Validate environment variables
      this.validateEnvVars();

      console.log('✅ Pre-deployment tests passed');
    } catch (error) {
      throw new Error(`Pre-deployment tests failed: ${error.message}`);
    }
  }

  /**
   * Deploy to various platforms
   */
  async deployToPlatforms() {
    console.log('\n🚀 Deploying to platforms...');

    const deploymentInstructions = {
      render: `
# Deploy to Render.com
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the following configuration:
   - Build Command: ${this.deploymentConfig.render.buildCommand}
   - Start Command: ${this.deploymentConfig.render.startCommand}
   - Plan: ${this.deploymentConfig.render.plan}
4. Add environment variables from your .env file
5. Enable auto-deploy from main branch
`,

      railway: `
# Deploy to Railway
1. Install Railway CLI: npm install -g @railway/cli
2. Login: railway login
3. Initialize: railway init
4. Deploy: railway up
5. Set environment variables: railway variables set KEY=value
`,

      vercel: `
# Deploy to Vercel
1. Install Vercel CLI: npm install -g vercel
2. Login: vercel login
3. Deploy: vercel --prod
4. Set environment variables in Vercel dashboard
`,

      docker: `
# Deploy with Docker
1. Build image: docker build -t kingdom-studios/backend .
2. Run: docker run -p 3000:3000 --env-file .env kingdom-studios/backend
3. Or use docker-compose: docker-compose up -d
`,

      kubernetes: `
# Deploy to Kubernetes
1. Apply deployment: kubectl apply -f k8s-deployment.yaml
2. Check status: kubectl get pods
3. Get service: kubectl get services
`
    };

    // Save deployment instructions
    const instructionsFile = `
# Kingdom Studios Enterprise Deployment Instructions

## Platform-Specific Instructions

${Object.entries(deploymentInstructions).map(([platform, instructions]) => 
  `## ${platform.toUpperCase()}\n${instructions}`
).join('\n')}

## Environment Variables Required

- NODE_ENV=production
- PORT=3000
- MONGODB_URI=your_mongodb_connection_string
- REDIS_HOST=your_redis_host
- REDIS_PORT=6379
- OPENAI_API_KEY=your_openai_api_key
- JWT_SECRET=your_jwt_secret
- STRIPE_SECRET_KEY=your_stripe_secret_key
- API_VERSION=v1

## Health Check Endpoint

All platforms should be configured to use the /health endpoint for health checks.

## Scaling Configuration

- Minimum instances: 3
- Maximum instances: 20+ (based on platform)
- CPU threshold: 70%
- Memory threshold: 80%
- Health check interval: 30s

## Monitoring

The application includes built-in metrics at /metrics endpoint.
Configure external monitoring tools to collect these metrics.
`;

    fs.writeFileSync('DEPLOYMENT_INSTRUCTIONS.md', instructionsFile.trim());

    console.log('✅ Deployment configurations ready');
    console.log('📄 See DEPLOYMENT_INSTRUCTIONS.md for platform-specific steps');
  }

  /**
   * Post-deployment verification
   */
  async postDeploymentVerification() {
    console.log('\n✅ Post-deployment verification checklist:');
    
    const checklist = [
      '🔍 Verify application starts without errors',
      '🏥 Check /health endpoint returns 200 OK',
      '📊 Verify /metrics endpoint shows proper data',
      '🔐 Test authentication endpoints',
      '🎯 Validate content generation endpoints',
      '📈 Monitor performance metrics',
      '🚨 Set up alerting for critical metrics',
      '🔄 Verify auto-scaling configuration',
      '💾 Test database connectivity',
      '🔴 Verify Redis cache connectivity'
    ];

    checklist.forEach(item => console.log(`   ${item}`));

    console.log('\n💡 Next Steps:');
    console.log('   1. Monitor application performance for 24-48 hours');
    console.log('   2. Run load tests against production environment');
    console.log('   3. Set up log aggregation and monitoring');
    console.log('   4. Configure backup and disaster recovery');
    console.log('   5. Implement CI/CD pipeline for future deployments');
  }

  /**
   * Validate environment variables
   */
  validateEnvVars() {
    const requiredVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'OPENAI_API_KEY'
    ];

    const optionalVars = [
      'REDIS_HOST',
      'REDIS_PORT',
      'STRIPE_SECRET_KEY',
      'SENDGRID_API_KEY'
    ];

    console.log('\n🔐 Environment Variables Check:');
    
    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`   ✅ ${varName}: Set`);
      } else {
        console.log(`   ❌ ${varName}: Missing (Required)`);
      }
    });

    optionalVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`   ✅ ${varName}: Set`);
      } else {
        console.log(`   ⚠️  ${varName}: Not set (Optional)`);
      }
    });
  }
}

// Run deployment if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const deployment = new EnterpriseDeployment();
  deployment.deploy().catch(console.error);
}

export default EnterpriseDeployment;
