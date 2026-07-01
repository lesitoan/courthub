# 🚀 Hướng Dẫn Deploy

## Yêu Cầu Hệ Thống

### Server Requirements
- **OS**: Ubuntu 20.04+ hoặc Debian 11+
- **RAM**: Tối thiểu 2GB (khuyến nghị 4GB)
- **Storage**: Tối thiểu 20GB SSD
- **CPU**: 2+ cores

### Software Requirements
- Docker 20.10+
- Docker Compose v2+
- (Optional) Domain name và SSL certificate

---

## 1. 🐳 Deploy với Docker

### 1.1. Clone repository
```bash
git clone https://github.com/your-repo/court-booking-system.git
cd court-booking-system
```

### 1.2. Cấu hình môi trường
```bash
# Copy environment file
cp docker/.env.example docker/.env

# Edit với các giá trị thực
nano docker/.env
```

**Các biến quan trọng cần thay đổi:**
```env
POSTGRES_PASSWORD=your-very-strong-password
JWT_SECRET=generate-a-256-bit-secret-key
JWT_REFRESH_SECRET=generate-another-256-bit-secret-key
```

### 1.3. Build và chạy
```bash
cd docker

# Build images
docker compose -f docker-compose.prod.yml build

# Start services
docker compose -f docker-compose.prod.yml up -d

# Xem logs
docker compose -f docker-compose.prod.yml logs -f
```

### 1.4. Seed dữ liệu mẫu (lần đầu)
```bash
# Chạy seed script
docker compose -f docker-compose.prod.yml exec backend npx prisma db seed
```

---

## 2. 🔐 Cấu hình SSL với Let's Encrypt

### 2.1. Install Certbot
```bash
sudo apt update
sudo apt install certbot
```

### 2.2. Generate certificate
```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

### 2.3. Copy certificates
```bash
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem docker/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem docker/ssl/key.pem
```

### 2.4. Cập nhật nginx.conf cho HTTPS
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... other config
}
```

---

## 3. 📊 Monitoring & Logs

### Xem logs
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Backend only
docker compose -f docker-compose.prod.yml logs -f backend

# Database
docker compose -f docker-compose.prod.yml logs -f postgres
```

### Health check
```bash
# Check containers status
docker compose -f docker-compose.prod.yml ps

# Test API health
curl http://localhost/api/health
```

---

## 4. 🔄 Backup & Restore

### Backup database
```bash
# Create backup
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U courtify courtify > backup_$(date +%Y%m%d).sql

# Automated daily backup (add to crontab)
0 2 * * * cd /path/to/project/docker && docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U courtify courtify > /backups/courtify_$(date +\%Y\%m\%d).sql
```

### Restore database
```bash
# Restore from backup
cat backup_20260204.sql | docker compose -f docker-compose.prod.yml exec -T postgres psql -U courtify courtify
```

---

## 5. 🔧 Maintenance

### Update application
```bash
cd /path/to/project

# Pull latest code
git pull origin main

# Rebuild and restart
cd docker
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# Run migrations
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### Restart services
```bash
docker compose -f docker-compose.prod.yml restart
```

### Stop all services
```bash
docker compose -f docker-compose.prod.yml down
```

### Remove all data (CAUTION!)
```bash
docker compose -f docker-compose.prod.yml down -v
```

---

## 6. 🐛 Troubleshooting

### Database connection issues
```bash
# Check if postgres is running
docker compose -f docker-compose.prod.yml ps postgres

# Check postgres logs
docker compose -f docker-compose.prod.yml logs postgres
```

### Frontend not loading
```bash
# Check nginx logs
docker compose -f docker-compose.prod.yml logs frontend

# Verify nginx config
docker compose -f docker-compose.prod.yml exec frontend nginx -t
```

### Backend errors
```bash
# Check backend logs
docker compose -f docker-compose.prod.yml logs backend

# Enter container for debugging
docker compose -f docker-compose.prod.yml exec backend sh
```

---

## 7. 📝 Default Accounts

Sau khi chạy seed:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@courtify.vn | admin123 |
| Manager | manager@courtify.vn | manager123 |
| Staff | staff@courtify.vn | staff123 |

⚠️ **Quan trọng**: Đổi mật khẩu ngay sau khi deploy production!

---

## 8. 🌐 Cấu hình Firewall

```bash
# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

---

## Support

Liên hệ hỗ trợ kỹ thuật:
- Email: support@courtify.vn
- Hotline: 028 1234 5678
