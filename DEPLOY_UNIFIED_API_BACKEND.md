# 🚀 Deploy Unified API Backend

This guide will help you deploy the unified API backend that serves all six Kingdom apps.

## 🎯 **Overview**

The unified API backend provides a single, scalable endpoint for all Kingdom Collective apps:

- **Kingdom Studios** - Content generation and management
- **Kingdom Clips** - Video processing and analytics
- **Kingdom Voice** - Audio recording and spiritual content
- **Kingdom Launchpad** - Product management and e-commerce
- **Kingdom Circle** - Community and mentorship
- **Kingdom Lens** - Photography and portfolio management

## 📋 **Prerequisites**

### **Required Services**

- Node.js 18+ and npm
- MongoDB or PostgreSQL database
- Redis for caching (optional but recommended)
- Cloud storage (AWS S3, Google Cloud Storage, etc.)
- SSL certificate for HTTPS

### **Environment Variables**

```env
# Server Configuration
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=mongodb://localhost:27017/kingdom_collective
# or for PostgreSQL:
# DATABASE_URL=postgresql://username:password@localhost:5432/kingdom_collective

# Redis (optional)
REDIS_URL=redis://localhost:6379

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-key

# Storage Configuration
STORAGE_BUCKET=kingdom-collective-storage
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=your-access-key
STORAGE_SECRET_KEY=your-secret-key

# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## 🚀 **Deployment Steps**

### **Step 1: Prepare the Backend**

```bash
# Navigate to backend directory
cd kingdom-studios-backend

# Install dependencies
npm install

# Create production build
npm run build

# Set environment variables
cp .env.example .env
# Edit .env with your production values
```

### **Step 2: Database Setup**

#### **MongoDB Setup**

```bash
# Install MongoDB (if not already installed)
# Ubuntu/Debian:
sudo apt-get install mongodb

# macOS:
brew install mongodb

# Start MongoDB
sudo systemctl start mongodb

# Create database
mongo
use kingdom_collective
db.createUser({
  user: "kingdom_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

#### **PostgreSQL Setup**

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE kingdom_collective;
CREATE USER kingdom_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE kingdom_collective TO kingdom_user;
\q
```

### **Step 3: Redis Setup (Optional but Recommended)**

```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server

# Test Redis
redis-cli ping
# Should return: PONG
```

### **Step 4: Storage Setup**

#### **AWS S3 Setup**

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
# Enter your Access Key ID, Secret Access Key, region, and output format
```

#### **Create S3 Bucket**

```bash
aws s3 mb s3://kingdom-collective-storage
aws s3api put-bucket-cors --bucket kingdom-collective-storage --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": []
    }
  ]
}'
```

### **Step 5: SSL Certificate Setup**

#### **Using Let's Encrypt (Recommended)**

```bash
# Install Certbot
sudo apt-get install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d api.kingdomcollective.pro

# Certificate files will be in:
# /etc/letsencrypt/live/api.kingdomcollective.pro/fullchain.pem
# /etc/letsencrypt/live/api.kingdomcollective.pro/privkey.pem
```

### **Step 6: Deploy with PM2**

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'kingdom-unified-api',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### **Step 7: Nginx Configuration**

```bash
# Install Nginx
sudo apt-get install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/kingdom-api
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name api.kingdomcollective.pro;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.kingdomcollective.pro;

    ssl_certificate /etc/letsencrypt/live/api.kingdomcollective.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.kingdomcollective.pro/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # File upload size limit
    client_max_body_size 100M;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/kingdom-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **Step 8: Firewall Configuration**

```bash
# Configure UFW firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### **Step 9: Monitoring Setup**

#### **Install Monitoring Tools**

```bash
# Install monitoring tools
npm install -g pm2-logrotate
pm2 install pm2-logrotate

# Setup log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

#### **Health Check Endpoint**

The API includes a health check endpoint at `/api/v1/status` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "memory": {
    "used": "150MB",
    "total": "1GB"
  },
  "database": "connected",
  "redis": "connected"
}
```

## 🔧 **Post-Deployment Verification**

### **1. Test API Endpoints**

```bash
# Test health endpoint
curl https://api.kingdomcollective.pro/api/v1/status

# Test unified API endpoint
curl https://api.kingdomcollective.pro/api/v1/unified/status

# Test app-specific endpoints
curl -H "x-app-id: kingdom-studios" https://api.kingdomcollective.pro/api/v1/unified/studios/status
curl -H "x-app-id: kingdom-clips" https://api.kingdomcollective.pro/api/v1/unified/clips/status
```

### **2. Test File Upload**

```bash
# Test file upload endpoint
curl -X POST \
  -H "x-app-id: kingdom-clips" \
  -F "file=@test-video.mp4" \
  https://api.kingdomcollective.pro/api/v1/unified/clips/upload
```

### **3. Test Authentication**

```bash
# Test login endpoint
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  https://api.kingdomcollective.pro/api/v1/unified/auth/login
```

## 📊 **Monitoring & Maintenance**

### **PM2 Commands**

```bash
# View logs
pm2 logs kingdom-unified-api

# Monitor processes
pm2 monit

# Restart application
pm2 restart kingdom-unified-api

# Update application
pm2 reload kingdom-unified-api

# View statistics
pm2 show kingdom-unified-api
```

### **Nginx Commands**

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **Database Maintenance**

```bash
# MongoDB backup
mongodump --db kingdom_collective --out /backup/$(date +%Y%m%d)

# PostgreSQL backup
pg_dump kingdom_collective > /backup/kingdom_collective_$(date +%Y%m%d).sql
```

## 🔒 **Security Considerations**

### **SSL/TLS**

- Use Let's Encrypt for free SSL certificates
- Automate certificate renewal
- Use strong cipher suites
- Enable HSTS headers

### **Rate Limiting**

- Implement per-app rate limiting
- Use Redis for distributed rate limiting
- Monitor and adjust limits based on usage

### **Authentication**

- Use secure JWT tokens
- Implement token refresh
- Store sensitive data encrypted
- Regular security audits

### **Data Protection**

- Encrypt data at rest
- Use secure connections
- Implement proper access controls
- Regular backups

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Application Won't Start**

```bash
# Check logs
pm2 logs kingdom-unified-api

# Check environment variables
pm2 env kingdom-unified-api

# Restart with fresh environment
pm2 restart kingdom-unified-api --update-env
```

#### **2. Database Connection Issues**

```bash
# Test database connection
node -e "require('./src/config/database.js').testConnection()"

# Check database status
sudo systemctl status mongodb
# or
sudo systemctl status postgresql
```

#### **3. File Upload Issues**

```bash
# Check storage credentials
aws s3 ls s3://kingdom-collective-storage

# Test upload permissions
aws s3 cp test.txt s3://kingdom-collective-storage/
```

#### **4. SSL Certificate Issues**

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect api.kingdomcollective.pro:443
```

## 📈 **Performance Optimization**

### **1. Enable Compression**

```nginx
# Add to Nginx configuration
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### **2. Implement Caching**

```javascript
// Add Redis caching to API responses
const cache = require("redis").createClient(process.env.REDIS_URL);

app.use("/api/v1/unified/*", async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  const cached = await cache.get(key);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  next();
});
```

### **3. Database Optimization**

```javascript
// Add database connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 🎉 **Deployment Complete!**

Your unified API backend is now deployed and ready to serve all six Kingdom apps. The system provides:

- ✅ **Single API endpoint** for all apps
- ✅ **App-specific identification** and rate limiting
- ✅ **Scalable architecture** with load balancing
- ✅ **Secure HTTPS** with SSL certificates
- ✅ **Monitoring and logging** for maintenance
- ✅ **Performance optimization** for high traffic

The unified API system is now ready to power your entire Kingdom Collective ecosystem! 🏛️✨
