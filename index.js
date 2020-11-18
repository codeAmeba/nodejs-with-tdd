const express = require('express');
const app = express();
const morgan = require('morgan');

const users = [
  { id: 1, name: 'Tom' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Mike' }
];

app.use(morgan('dev'));

app.get('/users', (req, res) => {
  req.query.limit = req.query.limit || 10;
  const limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }
  res.json(users.slice(0, limit));
});

app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(is)) return res.status(400).end();

  const user = users.filter(user => user.id === id)[0];
  if (!user) return res.status(404).end();

  res.json(user);
});

app.listen(3000, () => {
  console.log('server start');
});

module.exports = app;
