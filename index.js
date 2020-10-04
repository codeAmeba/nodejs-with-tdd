// 1. express 모듈 가져옴
const express = require('express');

// 2. express 객체를 생성하여 app 변수에 할당
const app = express();

// 4. GET 요청 시의 라우팅 설정.
// 첫 번째 파라미터로는 요청 경로, 두 번째 파라미터로는 실행할 콜백 함수
// 콜백 함수의 파라미터로는 요청객체와 응답객체가 들어옴
app.get('/', (req, res) => {
  res.send('Hello Express'); // -> Hello Express 문자열을 클라이언트로 전송
});

// 3. listen 함수를 통해 서버를 구동.
// 첫 번째 파라미터로는 포트 번호, 두 번째 파라미터로는 서버 구동 시 실행되는 콜백 함수
app.listen(3000, () => {
  console.log('server start');
});
