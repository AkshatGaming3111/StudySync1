const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

const apiRoutes = require('./routes/api');
const billingRoutes = require('./routes/billing');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static Front-End
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// API Routes
app.use('/api', apiRoutes);
app.use('/api/billing', billingRoutes);

// Suite Server Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'StudySync - AI Educational Suite Hub Server',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for single-page routing
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api/')) return next();
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log('================================================================');
  console.log('🎓 StudySync – AI Educational Suite Central Index Portal');
  console.log(`🌐 Server active on: http://localhost:${PORT}`);
  console.log(`📡 Suite Health Endpoint: http://localhost:${PORT}/health`);
  console.log(`💳 Billing API: http://localhost:${PORT}/api/billing/plans`);
  console.log(`🔗 Target Website 1 (Planner):   ${process.env.PLANNER_URL || 'http://localhost:5000'}`);
  console.log(`🔗 Target Website 2 (Classroom): ${process.env.CLASSROOM_URL || 'http://localhost:5001'}`);
  console.log('================================================================');
});
