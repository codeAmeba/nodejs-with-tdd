const express = require('express');
const app = express();
const morgan = require('morgan');

const users = [
  { id: 1, name: 'Tom' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Mike' },
];

app.use(morgan('dev'));

app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(3000, () => {
  console.log('server start');
});

module.exports = app;