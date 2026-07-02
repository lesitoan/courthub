const { Client } = require('ssh2');

const host = '100.71.168.118';
const username = 'toandev';
const password = '123456';

const commands = [
  'echo "=== BẮT ĐẦU CẬP NHẬT CODE BACKEND ==="',
  'cd ~/courthub-temp',
  'echo "=> Đang kéo code mới từ GitHub (nhánh develop)..."',
  'git pull origin develop',
  'echo "=> Đang rebuild container bằng Docker Compose (Dùng sudo, không cache)..."',
  'echo "123456" | sudo -S docker compose build --no-cache',
  'echo "=> Đang khởi động container API..."',
  'echo "123456" | sudo -S docker compose up -d',
  'echo "=== CẬP NHẬT HOÀN TẤT ==="',
  'echo "=> Kiểm tra log container API:"',
  'sleep 3',
  'echo "123456" | sudo -S docker logs --tail 20 courthub-api-temp'
].join(' && ');

console.log(`Connecting to server ${host} to update backend with sudo...`);

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection Established. Running update script...');
  
  conn.exec(commands, (err, stream) => {
    if (err) {
      console.error('Error executing commands:', err);
      conn.end();
      process.exit(1);
    }
    
    stream.on('close', (code, signal) => {
      console.log(`\nUpdate finished with code: ${code}`);
      conn.end();
      if (code !== 0) {
        process.exit(code);
      }
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      const text = data.toString();
      if (!text.includes('password for')) {
        process.stderr.write(text);
      }
    });
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
}).connect({
  host,
  port: 22,
  username,
  password
});
