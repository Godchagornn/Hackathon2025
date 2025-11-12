const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes');
const { pool } = require('./database/client');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/testdb', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message });
});

module.exports = app;
