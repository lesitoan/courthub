const { Client } = require('ssh2');

const host = '100.71.168.118';
const username = 'toandev';
const password = '123456';

const commands = [
  'echo "=== LOGS CỦA API CONTAINER ==="',
  'echo "123456" | sudo -S docker logs --tail 100 courthub-api-temp'
].join(' && ');

console.log(`Connecting to ${host} to check detailed logs...`);

const conn = new Client();
conn.on('ready', () => {
  conn.exec(commands, (err, stream) => {
    if (err) {
      console.error('Error executing commands:', err);
      conn.end();
      process.exit(1);
    }
    
    stream.on('close', (code, signal) => {
      conn.end();
      process.exit(code);
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
