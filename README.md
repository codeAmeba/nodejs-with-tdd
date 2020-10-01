# TDD로 만드는 Node.js API 서버

- [인프런 | 테스트주도개발(TDD)로 만드는 NodeJS API 서버](https://www.inflearn.com/course/%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%A3%BC%EB%8F%84%EA%B0%9C%EB%B0%9C-tdd-nodejs-api/dashboard)

## 환경

- Node.js
- VSCode
- Terminal

## Node.js 특징

- Node.js는 브라우저 밖에서 자바스크립트 코드를 실행할 수 있도록 해주는 실행환경
- 크롬의 V8 엔진(자바스크립트 코드 해석기)이 내장되어 있음
- 이벤트 기반의 비동기 I/O 프레임워크
- CommonJS를 구현한 모듈 시스템

## 이벤트 기반의 비동기 I/O 프레임워크

![](https://miro.medium.com/max/982/1*xm_WajiPlaOeJWcqgJb1xQ.png)

클라이언트에서 요청(request)을 보내면, Node.js는 이 요청을 이벤트로 만들어 이벤트 큐(Queue)에 넣는다. 그리고 이벤트 루프(Event Loop)는 이벤트 큐의 이벤트를 하나씩 꺼내 실행하는데, 이벤트 루프는 싱글스레드이기 때문에 한 번에 하나의 이벤트만 실행하며, 실행된 이벤트는 클라이언트로 응답(response)의 형태로 전달된다.

이때, 이벤트 루프를 거쳐 즉시 응답될 수 있는 이벤트가 있는 반면에 비교적 긴 시간이 소요되는 이벤트도 있다. 이러한 것들까지 이벤트 루프에서 실행하려 하면 블로킹이 걸리기 때문에 이럴 때에는 다른 쓰레드(worker)에게 이벤트를 위임하게 된다. 이벤트를 위임받은 worker는 이벤트 루프와는 별개로 이벤트를 처리한 뒤 결과만 이벤트 큐에 다시 돌려준다.

## 모듈 시스템

브라우저에서는 모듈 시스템을 구현하기 위해 window context를 사용하거나 RequireJS와 같은 의존성 로더를 사용한다. 반면에 Node.js에서는 **파일형태로 모듈을 관리할 수 있는 CommonJS** 로 구현한다. 다시 말해 Node.js는 서버측에서 사용되는 자바스크립트 환경인 만큼 OS를 비롯해 로컬의 여러 파일에도 접근을 할 수 있는데, 그러한 특성을 살려 보다 효율적으로 모듈을 관리하기 위해 CommonJS 스펙을 활용하여 파일형태로 모듈을 관리한다고 할 수 있다.

```javascript
// browser
window.myModule = function () {
  return 'myModule';
};

myModule(); // "myModule"

// Node.js
const http = require('http');
http.createServer();
```

위의 `http`와 같이 Node.js에서 제공되는 모듈을 가져다 쓸 수도 있고,

```javascript
// math.js
function sum(a, b) {
  return a + b;
}
module.exports = {
  sum: sum,
};

// index.js
const math = require('./math');
const result = math.sum(1, 2);
```

위의 `math` 모듈처럼 사용자 정의 모듈을 생성하여 내보내고, 가져다 쓸 수 있다. 그 외에도 그때 그때 필요한 라이브러리를 설치하여 서드파티 모듈을 활용할 수도 있다.

**참고:**

- [JavaScript 표준을 위한 움직임: CommonJS와 AMD](https://d2.naver.com/helloworld/12864)

## 비동기

자바스크립트에는 비동기 코드가 많고, Node.js 역시 마찬가지로 비동기 코드가 많다. 애초에 Node.js는 기본적으로 비동기로 동작한다. 파일을 읽을 때에도 비동기로 동작하며, 네트워크 통신을 할 때에도 비동기로 통신해야 한다. 그렇기 때문에 Node.js를 사용함에 있어서 **비동기 처리에 익숙해질 필요가 있다.**

대표적인 예시로 Node.js에는 `readFile`과 `readFileSync`라는 메서드가 있다. 목적만 놓고 보면 동일한 메서드인데, 전자는 비동기로, 후자는 동기로 동작하게 된다.

```javascript
const fs = require('fs');

// 동기
const data = fs.readFileSync('./data.txt', 'utf-8');
console.log(data); // This is data file

// 비동기
const data = fs.readFile('./data.txt', 'utf-8', function (err, result) {
  console.log(result); // This is data file
});
```

위의 경우에서 `readFileSync`는 파일을 다 읽을 때까지 후속 코드의 실행을 블록킹하게 되지만, `readFile`은 비동기적으로 동작하기 때문에 파일을 읽는 동안 후속 코드의 실행을 블록킹하지 않고, 파일을 다 읽었다는 이벤트가 발생했을 때 콜백함수가 실행된다. 만일 이때, 파일을 제대로 못 읽었다거나 그외 어떤 에러가 있다면 콜백함수의 첫 번째 파라미터인 `err`에 값이 담기게 되고, 에러가 없다면 두 번째 파라미터에 값이 담긴다.

**참고:**

- [블로킹과 논블로킹 살펴보기](https://nodejs.org/ko/docs/guides/blocking-vs-non-blocking/)

## 서버 실행하기

[Node.js 공식문서](https://nodejs.org/en/about/)에 서버를 실행할 수 있는 예시 코드가 있다.

```javascript
// index.js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

이를 통해 간단히 서버를 실행하고 Hello World를 확인할 수 있다. 서버를 띄우기 위해서는 터미널에서 `node index.js`를 입력한 뒤 브라우저를 열어 `localhost:3000`으로 접속해보면 확인할 수 있다. 또는, 다른 터미널을 하나 더 열어 `curl -X GET 'localhost:3000'`을 입력하면 브라우저에 출력된 내용을 터미널에서 확인 가능하다.
그러나 매번 위와 같이 변경 사항이 있을 때마다 서버를 재실행 하는 것은 번거롭기 때문에 변경 사항이 자동으로 적용되도록 `nodemon`을 설치하는 것을 추천한다.
