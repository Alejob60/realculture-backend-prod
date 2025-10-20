const http = require('http');

// Verificar que la aplicación esté respondiendo correctamente
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.status === 'ok' || result.status === 'healthy') {
        console.log('✅ Health check passed');
        process.exit(0);
      } else {
        console.log('❌ Health check failed:', result);
        process.exit(1);
      }
    } catch (error) {
      console.log('❌ Health check failed: Invalid JSON response');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Health check failed:', error.message);
  process.exit(1);
});

req.end();