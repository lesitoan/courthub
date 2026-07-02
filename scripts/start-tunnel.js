const { Client } = require('ssh2');

const host = '100.71.168.118';
const username = 'toandev';
const password = '123456';

const token = 'eyJhIjoiOTkwNGIyODMyYTRiMjY4NmNmOWI0MTE1ZmRlMTVkMmEiLCJ0IjoiYmFkOTVjZTItMDQ0ZS00MDMyLWE4NGItY2I4MWJmYWNmN2I5IiwicyI6Ik9HRmpaakUxTkRVdE1HRTRZaTAwT0ROakxUZzFPVGN0WVdNeVltVTBOVFJoTkRjeCJ9';

const commands = [
  'echo "=== STOPPING EXISTING CLOUDFLARED CONTAINER IF ANY ==="',
  `echo "123456" | sudo -S docker rm -f cloudflared-tunnel 2>/dev/null || true`,
  'echo ""',
  'echo "=== STARTING CLOUDFLARED TUNNEL ==="',
  `echo "123456" | sudo -S docker run -d \\
    --name cloudflared-tunnel \\
    --restart unless-stopped \\
    --network host \\
    cloudflare/cloudflared:latest tunnel --no-autoupdate run --token ${token}`,
  'echo ""',
  'echo "=== CLOUDFLARED CONTAINER STATUS ==="',
  'sleep 3',
  'echo "123456" | sudo -S docker ps --filter name=cloudflared-tunnel',
  'echo ""',
  'echo "=== CLOUDFLARED LOGS ==="',
  'sleep 2',
  'echo "123456" | sudo -S docker logs --tail 20 cloudflared-tunnel'
].join(' && ');

console.log(`Connecting to ${host} to start Cloudflare Tunnel...`);

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
