# Backend Deployment Guide

## 🚀 Automatic Deployment (CI/CD)

Every push to `main` branch automatically deploys to EC2 server.

### Prerequisites

1. **EC2 Server Setup**
   - Ubuntu server with Node.js and PM2 installed
   - Backend code cloned to: `/home/ubuntu/reptrack-backend`
   - PM2 process name: `reptrack-backend`

2. **GitHub Repository Secrets**

   Go to: **Repository → Settings → Secrets and variables → Actions**

   Add these secrets:

   | Secret Name | Value | Description |
   |------------|-------|-------------|
   | `EC2_HOST` | `13.221.184.255` | EC2 server IP address |
   | `EC2_USERNAME` | `ubuntu` | SSH username |
   | `EC2_SSH_KEY` | Private SSH key | Full SSH private key (including BEGIN/END lines) |

3. **SSH Key Setup**

   Add your public SSH key to EC2:
   ```bash
   # On EC2 server
   echo "your-public-key" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

---

## 📋 Deployment Process

### Automatic (Recommended)
```bash
git add .
git commit -m "your changes"
git push origin main
```
✅ GitHub Actions will automatically:
- SSH into EC2 server
- Pull latest code
- Install dependencies
- Restart PM2 process

### Manual Deployment
```bash
# SSH into server
ssh -i your-key.pem ubuntu@13.221.184.255

# Navigate to project
cd /home/ubuntu/reptrack-backend

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Restart PM2
pm2 restart reptrack-backend
pm2 save
```

---

## 🔍 Monitoring

**Check Deployment Status:**
- GitHub Actions: https://github.com/GriffonWS/reptrack-backend/actions

**Check Server Status:**
```bash
# PM2 status
pm2 status reptrack-backend

# View logs
pm2 logs reptrack-backend

# Check if running
curl http://13.221.184.255:5000
```

---

## ⚠️ Important Notes

- **`.env` file**: Not tracked in git. Manage separately on server.
- **Port**: Backend runs on port 5000
- **Process Manager**: Uses PM2 for process management
- **Node Version**: Requires Node.js v14+ (currently using v18.20.8)

---

## 🐛 Troubleshooting

**Deployment failed?**
1. Check GitHub Actions logs
2. Verify SSH key is correct
3. Ensure all secrets are set in GitHub
4. Check PM2 logs: `pm2 logs reptrack-backend`

**Can't connect to server?**
1. Verify security group allows SSH (port 22)
2. Check EC2 instance is running
3. Verify SSH key permissions: `chmod 600 your-key.pem`
