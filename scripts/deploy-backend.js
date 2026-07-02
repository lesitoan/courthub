const { Client } = require('ssh2');

const host = '100.71.168.118';
const username = 'toandev';
const password = '123456';

const envContent = `NODE_ENV=production
DATABASE_URL="postgresql://postgres:toandeptrai%40123@db.bwyvgohkoydfgceldtsr.supabase.co:5432/postgres?schema=public"
JWT_SECRET="courthub-super-secret-jwt-key-prod-2026"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="courthub-super-secret-refresh-key-prod-2026"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=8080
FRONTEND_URL="https://lesitoan-courthub.vercel.app"
CORS_ORIGIN="https://courthub-frontend.vercel.app,https://lesitoan-courthub.vercel.app"
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100`;

const composeContent = `version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile.backend
    container_name: courthub-api-temp
    restart: unless-stopped
    network_mode: host
    environment:
      DATABASE_URL: \${DATABASE_URL}
      JWT_SECRET: \${JWT_SECRET}
      JWT_REFRESH_SECRET: \${JWT_REFRESH_SECRET}
      JWT_EXPIRES_IN: \${JWT_EXPIRES_IN}
      JWT_REFRESH_EXPIRES_IN: \${JWT_REFRESH_EXPIRES_IN}
      NODE_ENV: \${NODE_ENV}
      PORT: \${PORT}
      FRONTEND_URL: \${FRONTEND_URL}
      CORS_ORIGIN: \${CORS_ORIGIN}
`;

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection Established.');
  
  // Bước 1: Khởi động SFTP để ghi file an toàn
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP Error:', err);
      conn.end();
      process.exit(1);
    }
    
    console.log('SFTP Session Established. Ensuring directories...');
    
    // Tạo thư mục tạm trên server bằng lệnh SSH shell trước
    conn.exec('mkdir -p ~/courthub-temp', (err, stream) => {
      if (err) {
        console.error('Error creating directory:', err);
        conn.end();
        process.exit(1);
      }
      
      stream.on('close', () => {
        console.log('=> Thư mục ~/courthub-temp đã được tạo/kiểm tra.');
        
        // Ghi file .env bằng SFTP
        sftp.writeFile('/home/toandev/courthub-temp/.env', envContent, (err) => {
          if (err) {
            console.error('Error writing .env via SFTP:', err);
            conn.end();
            process.exit(1);
          }
          console.log('=> Ghi file .env thành công.');
          
          // Ghi file docker-compose.yml bằng SFTP
          sftp.writeFile('/home/toandev/courthub-temp/docker-compose.yml', composeContent, (err) => {
            if (err) {
              console.error('Error writing docker-compose.yml via SFTP:', err);
              conn.end();
              process.exit(1);
            }
            console.log('=> Ghi file docker-compose.yml thành công.');
            
            // Bước 2: Chạy các lệnh Git và Docker qua sudo
            runDockerCommands();
          });
        });
      }).on('data', (data) => {
        process.stdout.write(data.toString());
      });
    });
  });
  
  function runDockerCommands() {
    console.log('Running Git and Docker commands with sudo...');
    
    const commands = [
      'cd ~/courthub-temp',
      'if [ ! -d .git ]; then echo "=> Đang clone dự án từ GitHub (nhánh develop)..." && git clone -b develop https://github.com/lesitoan/courthub.git .; else echo "=> Đang cập nhật code mới từ GitHub..." && git pull origin develop; fi',
      'echo "=> Đang chạy docker compose up -d --build (Dùng sudo)..."',
      'echo "123456" | sudo -S docker compose up -d --build',
      'echo "=== HOÀN THÀNH SETUP DOCKER ==="',
      'echo "=> Kiểm tra các container đang hoạt động:"',
      'echo "123456" | sudo -S docker ps --filter name=courthub',
      'echo "=> Kiểm tra log container API:"',
      'sleep 3',
      'echo "123456" | sudo -S docker logs --tail 20 courthub-api-temp'
    ].join(' && ');
    
    conn.exec(commands, (err, stream) => {
      if (err) {
        console.error('Error executing docker commands:', err);
        conn.end();
        process.exit(1);
      }
      
      stream.on('close', (code) => {
        console.log(`\nDeployment finished with code: ${code}`);
        conn.end();
        if (code !== 0) {
          process.exit(code);
        }
      }).on('data', (data) => {
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        // Lọc log nhập password của sudo
        const text = data.toString();
        if (!text.includes('password for')) {
          process.stderr.write(text);
        }
      });
    });
  }
}).on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
}).connect({
  host,
  port: 22,
  username,
  password
});
