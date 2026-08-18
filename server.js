const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const BUILD_DIR = path.join(__dirname, 'build');

console.log('═══════════════════════════════════════');
console.log('🚀 STARTING EXPRESS SERVER');
console.log('═══════════════════════════════════════');
console.log(`⏰ Time: ${new Date().toISOString()}`);
console.log(`📁 Current directory: ${__dirname}`);
console.log(`🔌 PORT: ${PORT}`);
console.log(`📦 Build path: ${BUILD_DIR}`);
console.log(`✅ Build directory exists: ${fs.existsSync(BUILD_DIR)}`);
console.log('═══════════════════════════════════════');

// Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error('❌ FATAL: Build directory does not exist!');
  console.error(`   Expected at: ${BUILD_DIR}`);
  process.exit(1);
}

// Check if index.html exists
const indexPath = path.join(BUILD_DIR, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ FATAL: index.html not found!');
  console.error(`   Expected at: ${indexPath}`);
  console.error(`   Build directory contents: ${fs.readdirSync(BUILD_DIR).join(', ')}`);
  process.exit(1);
}

console.log(`✅ index.html found: ${indexPath}`);

// Serve static files from build directory
app.use(express.static(BUILD_DIR, {
  index: false, // Disable default index.html serving, we handle it ourselves
  etag: false
}));

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('✅ GET /health');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    port: PORT,
    buildDir: BUILD_DIR,
    indexHtmlExists: fs.existsSync(indexPath)
  });
});

// API check endpoint  
app.get('/api/health', (req, res) => {
  console.log('✅ GET /api/health');
  res.json({ 
    status: 'api-ok', 
    timestamp: new Date().toISOString() 
  });
});

// Handle all other requests by serving index.html (for client-side routing)
app.get('*', (req, res) => {
  console.log(`📄 GET ${req.path} -> Serving index.html`);
  
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ ERROR: index.html disappeared: ${indexPath}`);
    return res.status(500).json({ 
      error: 'index.html not found',
      path: indexPath,
      timestamp: new Date().toISOString()
    });
  }
  
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`❌ Error sending index.html: ${err.message}`);
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Express Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

const server = app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log(`✅ SERVER STARTED SUCCESSFULLY`);
  console.log('═══════════════════════════════════════');
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`📄 App: Serving from ${BUILD_DIR}`);
  console.log('═══════════════════════════════════════');
});

server.on('error', (err) => {
  console.error('❌ FATAL Server Error:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('📢 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
