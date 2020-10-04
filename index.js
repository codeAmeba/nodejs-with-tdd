const express = require('express');
const app = express();

function commonMiddleware(req, res, next) {
  console.log('common middleware');
  next(new Error('what the error!'));
}

function errorMiddleware(err, req, res, next) {
  console.log(err.message);
  next();
}

app.use(commonMiddleware);
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
