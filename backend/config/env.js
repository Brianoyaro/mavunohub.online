require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  upload: {
    dir: process.env.UPLOAD_DIR,
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE),
  },
  cors: {
    origin: process.env.CORS_ORIGIN ? JSON.parse(process.env.CORS_ORIGIN) : '*',
  },
};
