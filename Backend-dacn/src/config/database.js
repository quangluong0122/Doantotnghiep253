import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionOptions = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    };

const pool = mysql.createPool({
  ...connectionOptions,
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 10000),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;