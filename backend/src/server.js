const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`API server ready on port ${PORT}`);
});