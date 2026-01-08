const { spawn } = require('child_process');
const path = require('path');

// Change to the server directory
const serverDir = path.join(__dirname, 'server');

require('./server/app.cjs');

// Start the server using ts-node
const serverProcess = spawn('npx', ['ts-node', 'server.ts'], {
  cwd: serverDir,
  stdio: 'inherit'
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
});