require('express-async-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const config = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the uploads directory
app.use('/uploads', express.static(config.upload.dir));
// sitemaps folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(routes);

// Explicit SEO routes for sitemap.xml, sitemap-products.xml, and sitemap-categories.xml
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/sitemap-products.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap-products.xml'));
});

app.get('/sitemap-categories.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap-categories.xml'));
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await sequelize.sync();
    console.log('Database models synchronized');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
