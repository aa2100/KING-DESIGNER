# Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] AWS S3 bucket created and configured
- [ ] SSL/TLS certificates prepared
- [ ] Domain configured and DNS updated
- [ ] TypeScript type checking passed
- [ ] All tests passing
- [ ] Build process successful

## Deployment Steps

### 1. Prepare Environment

```bash
# Create production environment file
cp .env.example .env.production

# Update with production values
nano .env.production
```

### 2. Build Application

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Type check
pnpm run check

# Run tests
pnpm run test

# Build
pnpm run build
```

### 3. Database Setup

```bash
# Generate and run migrations
pnpm run db:push

# Verify database connection
mysql -h your_host -u your_user -p your_database
```

### 4. Deploy to Server

#### Option A: Using Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "run", "start"]
```

#### Option B: Direct Deployment

```bash
# Copy files to server
scp -r dist/ config, package.json user@server:/app/

# On server:
cd /app
pnpm install --frozen-lockfile
pnpm run start
```

### 5. Configure Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name king-designer.com www.king-designer.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name king-designer.com www.king-designer.com;

    ssl_certificate /etc/letsencrypt/live/king-designer.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/king-designer.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6. Setup Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'king-designer',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Restart on server reboot
pm2 startup
```

### 7. Monitor Application

```bash
# View logs
pm2 logs king-designer

# View metrics
pm2 monit

# Watch application health
pm2 web
```

## Post-Deployment

### Health Checks

```bash
# Test API endpoint
curl https://king-designer.com/api/health

# Check database connection
curl https://king-designer.com/api/db-check

# Verify AWS S3 connection
curl https://king-designer.com/api/s3-check
```

### Monitoring Setup

1. **Error Tracking**: Setup Sentry for error monitoring
2. **Performance**: Use New Relic or similar APM
3. **Logs**: Configure centralized logging (e.g., ELK Stack)
4. **Uptime**: Setup uptime monitoring (e.g., Uptime Robot)

### Backup Strategy

```bash
# Daily database backup
0 2 * * * mysqldump -u user -p password database > /backups/db_$(date +\%Y\%m\%d).sql

# S3 backup script
0 3 * * * aws s3 sync s3://your-bucket /backups/s3_backup
```

## Troubleshooting

### Application won't start
- Check environment variables
- Verify database connection
- Check server logs: `pm2 logs king-designer`

### High memory usage
- Restart application: `pm2 restart king-designer`
- Check for memory leaks in code
- Review Node.js heap size configuration

### Database connection errors
- Verify MySQL service is running
- Check DATABASE_URL format
- Ensure user has proper permissions

### S3 upload failures
- Verify AWS credentials
- Check bucket permissions
- Ensure bucket CORS configuration

## Scaling

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple app instances
- Use read replicas for database

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching (Redis)

## Security Hardening

- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security updates
- [ ] Database encryption
- [ ] Secrets management
- [ ] Rate limiting
- [ ] DDoS protection

## Rollback Procedure

```bash
# If deployment fails, rollback to previous version
pm2 stop king-designer
git checkout previous_commit
pnpm run build
pm2 start ecosystem.config.js
```

## Support

For deployment issues, contact the development team or refer to server logs at `/app/logs/`
