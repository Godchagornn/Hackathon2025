const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const useSsl = process.env.DB_SSL === 'true'
  ? { rejectUnauthorized: false }
  : false;

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: useSsl,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'postgres',
      ssl: useSsl,
    };

const pool = new Pool(poolConfig);

/**
 * Shared query helper so modules can run SQL without instantiating new pools.
 */
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
