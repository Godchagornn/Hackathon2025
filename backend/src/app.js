const express = require('express');
const apiRouter = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', apiRouter);

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
