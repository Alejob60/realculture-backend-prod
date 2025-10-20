// Simple test script to verify CLI functionality
const { spawn } = require('child_process');

// Test the CLI help command
const cli = spawn('node', ['dist/cli/misy-cli.js', '--help']);

cli.stdout.on('data', (data) => {
  console.log(`CLI Output:\n${data}`);
});

cli.stderr.on('data', (data) => {
  console.error(`CLI Error:\n${data}`);
});

cli.on('close', (code) => {
  console.log(`CLI process exited with code ${code}`);
});