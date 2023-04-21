const http = require('http');

const connectToMongo = require('./db')
connectToMongo()

const hostname = '127.0.0.1';
const port = 6000;
// Middleware

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
