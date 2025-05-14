
const { spawn } = require('child_process');
const path = require('path');

// Start the frontend
const frontend = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit', 
  shell: true 
});

// Start the backend
const backend = spawn('node', ['server/index.js'], { 
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  frontend.kill('SIGINT');
  backend.kill('SIGINT');
  process.exit(0);
});

console.log('🚀 Development servers started!');
console.log('📱 Frontend: http://localhost:5173');
console.log('🖥️ Backend: http://localhost:3001');
