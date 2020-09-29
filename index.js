const fs = require('fs');

// 동기
// const data = fs.readFileSync('./data.txt', 'utf-8');
// console.log(data); // This is data file
// 비동기
const data = fs.readFile('./data.txt', 'utf-8', function(err, result) {
  console.log(result); // This is data file
})

