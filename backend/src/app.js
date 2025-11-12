const express = require('express');
const apiRouter = require('./routes');
const { pool } = require('./database/client');

const app = express();

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

module.exports = app;
