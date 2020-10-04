const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  res.send('this is users list');
});

app.listen(3000, () => {
  console.log('server start');
});
