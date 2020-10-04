const express = require('express');
const app = express();

function logger(req, res, next) {
  console.log('I am logger');
  next();
}

function logger2(req, res, next) {
  console.log('I am logger2');
  next();
}

app.use(logger2);
app.use(logger);

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
