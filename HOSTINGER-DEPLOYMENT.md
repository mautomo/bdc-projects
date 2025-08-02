# Hostinger VPS Deployment Guide

Complete guide to deploy your BDC projects on Hostinger VPS with Docker and Nginx.

## Prerequisites

- Hostinger VPS account
- Domain name pointed to your VPS
- SSH access to your VPS

## 🚀 Quick Deployment

### Step 1: Set up GitHub Repository

1. **Create GitHub repository:**
   ```bash
   # Replace YOUR_USERNAME with your GitHub username
   git remote add origin https://github.com/YOUR_USERNAME/bdc-projects.git
   git branch -M main
   git push -u origin main
   ```

2. **Update deployment script:**
   - Edit `deploy.sh` and replace `YOUR_USERNAME` with your GitHub username
   - Replace `your-domain.com` with your actual domain
   - Replace `your-email@domain.com` with your email

### Step 2: VPS Initial Setup

SSH into your Hostinger VPS:
```bash
ssh root@your-vps-ip
```

Update the system and install Git:
```bash
apt update && apt upgrade -y
apt install -y git curl wget
```

### Step 3: Deploy Automatically

Download and run the deployment script:
```bash
# Download the deployment script
curl -o deploy.sh https://raw.githubusercontent.com/YOUR_USERNAME/bdc-projects/main/deploy.sh

# Make it executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## 🔧 Manual Deployment Steps

If you prefer manual deployment or the auto-script fails:

### 1. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $USER

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 2. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

### 3. Clone and Setup Project

```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/bdc-projects.git
cd bdc-projects

# Install dependencies
cd bdc-competitive && npm install && cd ..
cd bdc-assessment && npm install && cd ..
```

### 4. Configure Domain

Update `nginx.conf` with your actual domains:
```nginx
# Replace these with your actual domains:
server_name competitive.yourdomain.com;
server_name assessment.yourdomain.com;
```

### 5. Build and Deploy

```bash
# Build Next.js applications
cd bdc-competitive && npm run build && cd ..
cd bdc-assessment && npm run build && cd ..

# Start with Docker Compose
docker-compose up --build -d
```

## 🌐 Domain Configuration

### DNS Settings

Point these subdomains to your VPS IP:
- `competitive.yourdomain.com` → BDC Competitive Analysis
- `assessment.yourdomain.com` → BDC Assessment Dashboard

### SSL Certificates (Let's Encrypt)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificates
certbot --nginx -d competitive.yourdomain.com -d assessment.yourdomain.com
```

## 📊 Project URLs After Deployment

- **BDC Competitive:** https://competitive.yourdomain.com
- **BDC Assessment:** https://assessment.yourdomain.com
- **Main Domain:** https://yourdomain.com (redirects to competitive)

## 🔍 Monitoring & Maintenance

### Check Container Status
```bash
docker-compose ps
docker-compose logs -f
```

### Update Deployment
```bash
cd /var/www/bdc-projects
git pull origin main
docker-compose up --build -d
```

### View Logs
```bash
# Application logs
docker-compose logs bdc-competitive
docker-compose logs bdc-assessment

# Nginx logs
docker-compose logs nginx
```

## 🛠️ Troubleshooting

### Port Issues
Make sure ports 80, 443, 3000, 3001 are open:
```bash
ufw allow 80
ufw allow 443
ufw allow 3000
ufw allow 3001
```

### Container Not Starting
```bash
# Check detailed logs
docker-compose logs --details

# Restart specific service
docker-compose restart bdc-competitive
```

### SSL Certificate Issues
```bash
# Renew certificates
certbot renew

# Test certificate renewal
certbot renew --dry-run
```

### Memory Issues
```bash
# Check memory usage
free -h
docker stats

# If low memory, increase swap
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

## 🔄 Automatic Updates

The deployment script sets up a cron job for daily updates at 2 AM:
```bash
# Check cron job
crontab -l

# View deployment logs
tail -f /var/log/bdc-deploy.log
```

## 📁 File Structure on VPS

```
/var/www/bdc-projects/
├── docker-compose.yml
├── nginx.conf
├── deploy.sh
├── bdc-competitive/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── bdc-assessment/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
└── ssl/                # SSL certificates
    ├── cert.pem
    └── key.pem
```

## 🆘 Support

If you encounter issues:

1. Check Docker logs: `docker-compose logs`
2. Verify DNS propagation: Use online DNS checker tools
3. Test without SSL first, then add certificates
4. Check Hostinger VPS firewall settings
5. Ensure your domain is properly configured in Hostinger panel

## 🔐 Security Notes

- Keep your VPS updated: `apt update && apt upgrade`
- Use strong passwords and SSH keys
- Configure UFW firewall
- Regularly backup your data
- Monitor logs for suspicious activity