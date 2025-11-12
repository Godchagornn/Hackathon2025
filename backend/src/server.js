const dotenv = require('dotenv');
const http = require('http');
const { initSocket } = require('./modules/messages/socket');

dotenv.config();

const app = require('./app');

const PORT = Number(process.env.PORT) || 4000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`API server ready on port ${PORT}`);
});
