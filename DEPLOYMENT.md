# 🚀 FinanceApp Deployment Guide

This guide covers deploying the FinanceApp to production with real-time functionality.

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- Git
- A cloud provider account (Vercel, AWS, DigitalOcean, etc.)

## 🎯 Deployment Options

### 1. Vercel (Recommended - Easiest)

#### Quick Deploy
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and deploy

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_APP_NAME=FinanceApp
   NEXT_PUBLIC_REALTIME_ENABLED=true
   NEXT_PUBLIC_NOTIFICATIONS_ENABLED=true
   ```

#### Custom Domain
- Add your domain in Vercel dashboard
- Configure DNS records as instructed

### 2. Docker Deployment

#### Local Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# Access the app
open http://localhost:3000
```

#### Production Docker
```bash
# Build production image
docker build -t finance-app .

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_APP_NAME=FinanceApp \
  finance-app
```

### 3. Traditional Server Deployment

#### Prerequisites
- Ubuntu 20.04+ server
- Nginx
- PM2 or similar process manager

#### Setup Steps
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Clone repository
git clone <your-repo>
cd finance-app

# Install dependencies
npm ci --production

# Build application
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "finance-app" -- start
pm2 startup
pm2 save
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

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
    }
}
```

## 🔌 Real-Time Server Setup

### Option 1: Separate Real-Time Server

#### Deploy Real-Time Server
```bash
# Create real-time server directory
mkdir realtime-server
cd realtime-server

# Install dependencies
npm init -y
npm install socket.io ioredis

# Start server
node index.js
```

#### Environment Variables
```bash
REDIS_URL=redis://your-redis-server:6379
NEXT_PUBLIC_APP_URL=https://your-domain.com
PORT=3001
```

### Option 2: Integrated with Main App

Add real-time functionality directly to your Next.js app using Socket.IO.

## 🗄️ Database Setup

### PostgreSQL (Recommended)

#### Local Setup
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb financeapp

# Create user
sudo -u postgres createuser --interactive
```

#### Production Setup
- Use managed PostgreSQL service (AWS RDS, DigitalOcean Managed Databases)
- Configure connection pooling
- Set up automated backups

### Redis Setup

#### Local Redis
```bash
# Install Redis
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### Production Redis
- Use managed Redis service (AWS ElastiCache, DigitalOcean Managed Redis)
- Configure persistence and replication

## 🔒 Security Configuration

### Environment Variables
```bash
# Production environment variables
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=FinanceApp
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_WS_URL=wss://your-domain.com
DATABASE_URL=postgresql://user:password@host:5432/database
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secret-jwt-key
```

### SSL/HTTPS Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Security Headers
The app includes security headers in `next.config.ts`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

## 📊 Monitoring & Analytics

### Application Monitoring
```bash
# Install monitoring tools
npm install -g pm2
pm2 install pm2-logrotate

# Monitor application
pm2 monit
pm2 logs
```

### Performance Monitoring
- Set up Google Analytics
- Configure error tracking (Sentry)
- Monitor server metrics

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to server
        run: |
          # Add your deployment commands here
```

## 🚀 Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Implement session sharing
- Configure database connection pooling

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Use CDN for static assets

## 🔧 Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor disk space and logs
- Backup database regularly
- Review security updates

### Backup Strategy
```bash
# Database backup
pg_dump financeapp > backup_$(date +%Y%m%d).sql

# Application backup
tar -czf app_backup_$(date +%Y%m%d).tar.gz /path/to/app
```

## 🆘 Troubleshooting

### Common Issues

#### App won't start
```bash
# Check logs
pm2 logs finance-app

# Check port availability
netstat -tulpn | grep :3000

# Check environment variables
echo $NODE_ENV
```

#### Database connection issues
```bash
# Test database connection
psql -h host -U user -d database

# Check connection string
echo $DATABASE_URL
```

#### Real-time not working
```bash
# Check WebSocket server
curl http://localhost:3001/health

# Check Redis connection
redis-cli ping
```

## 📞 Support

For deployment issues:
1. Check the logs
2. Verify environment variables
3. Test database connections
4. Review security configurations

## 🎯 Next Steps

After deployment:
1. Set up monitoring and alerts
2. Configure automated backups
3. Implement user analytics
4. Plan for scaling
5. Set up development/staging environments 