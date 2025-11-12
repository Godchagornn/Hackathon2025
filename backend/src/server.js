import express from 'express';
import dotenv from 'dotenv';
import mainRoutes from './routes/index.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api', mainRoutes);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`API server ready on port ${PORT}`);
});