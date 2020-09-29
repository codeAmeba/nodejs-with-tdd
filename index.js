const http = require('http');
const math = require('./math');

http.createServer();

const result = math.sum(1, 2);
console.log(result);