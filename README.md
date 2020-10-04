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

![node process](https://miro.medium.com/max/982/1*xm_WajiPlaOeJWcqgJb1xQ.png)

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

//  Node.js의 기본 모듈 중 http라는 모듈을 가져와서 변수에 할당
const http = require('http');

// hostname과 port에 각각 원하는 값을 할당
const hostname = '127.0.0.1';
const port = 3000;

// http 모듈의 메서드 중 createServer 메서드를 사용. request와 response를 파라미터로 받는 콜백함수를 파라미터로 넣은 값을 server라는 변수에 할당
const server = http.createServer((req, res) => {
  // 서버에 요청이 들어왔을 때 동작하는 코드
  res.statusCode = 200; // 요청에 대한 응답 상태코드
  res.setHeader('Content-Type', 'text/plain'); // 응답 데이터의 종류와 형태 정보를 헤더에 담음
  res.end('Hello Node'); // 요청에 의해 'Hello Node'라는 문자열을 클라이언트로 보냄
});

// listen 메서드는 서버를 요청 대기상태로 만들어주는 함수다. 여기서 대기상태란, 서버가 클라이언트로부터 요청을 받기 위해 종료되지 않고 대기 중인 상태를 말한다.
// listen 메서드는 port, hostname, 그리고 listen 메서드가 완료되면 호출되는 콜백함수까지 총 3개의 파라미터를 받는다.
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

이를 통해 간단히 서버를 실행하고 Hello Node를 확인할 수 있다. 서버를 띄우기 위해서는 터미널에서 `node index.js`를 입력한 뒤 브라우저를 열어 `localhost:3000`으로 접속해보면 확인할 수 있다. 또는, 다른 터미널을 하나 더 열어 `curl -X GET 'localhost:3000'`을 입력하면 브라우저에 출력된 내용을 터미널에서 확인 가능하다.
그러나 매번 위와 같이 변경 사항이 있을 때마다 서버를 재실행 하는 것은 번거롭기 때문에 변경 사항이 자동으로 적용되도록 `nodemon`을 설치하는 것을 추천한다.

> `127.0.0.1`은 `localhost`와 동일하다.

## 라우팅(Routing)

라우팅 처리를 하지 않으면, 모든 요청에 대해 동일한 내용으로만 응답을 하게 된다. 따라서 미리 어떤 경로(path)에서 어떤 응답을 보내줄 지 정해야 하는데, 이를 라우팅이라 한다.
클라이언트로부터의 요청은 `request`에 객체 형태로 담기게 되며, 이 객체에는 다양한 데이터가 포함되어 있는데, 이 중 `url`도 있기 때문에 이를 통하여 아래와 같이 요청에 따른 응답을 분기할 수 있다.

```javascript
// index.js

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello Node');
  } else if (req.url === '/users') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('User List');
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});
```

위와 같은 조건으로 서버를 실행했을 때, `curl -X GET '127.0.0.1:3000'`에는 'Hello Node'가, `curl -X GET '127.0.0.1:3000/user'`에는 'Not Found'가 출력되는 것을 볼 수 있다. 특정한 요청에 특정한 응답을 전달해야 하는 API의 기본적인 원리가 이와 같다고 할 수 있다. 그러나, 보통의 경우 적지 않은 API가 필요한데 일일이 위와 같이 분기하는 것은 상당히 비효율적이다. 그래서 보다 효율적이고 간단하게 라우팅 처리를 할 수 있는 도구를 이용해야 하는 대표적으로 Express.js가 있다.

## Express.js

Express.js는 Node.js로 만들어진 웹 프레임워크다. Express.js에는 대표적으로 다섯가지 개념이 있다.

- **어플리케이션**
- **미들웨어** : 함수들의 배열이라고 할 수 있으며, Express.js에 어떠한 기능을 추가할 때 미들웨어의 형태를 통해 추가한다.
- **라우팅** : 접속 경로에 따른 응답을 체계적으로 나눌 수 있다.
- **요청객체, 응답객체** : 기본적으로 http 모듈 안에서는 request(요청객체)와 response(응답객체)가 있는데, Express.js에서는 이를 한 번 Wrapper로 감싸 더욱 편리하게 쓸 수 있도록 메서드 형태로 제공한다.

**참고:**

- [Express.js](https://expressjs.com/ko/)

## 어플리케이션

Express.js의 인스턴스(객체)를 어플리케이션이라고 한다.

```javascript
const express = require('express');
const app = express();
```

위와 같이 Express.js 모듈을 가져와 `app`이라는 변수에 `express` 객체를 할당하는데, 이때 `app`이 어플리케이션이라는 개념이다. 이렇게 만들어진 어플리케이션을 통하여 **서버에 필요한 기능인 미들웨어를 추가** 할 수 있고, **라우팅 설정** 도 할 수 있으며,

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello Express');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

위와 같이 `listen` 메서드를 쓸 수 있기 때문에 **서버를 요청 대기 상태로 만들 수** 도 있다.

## 미들웨어(Middleware)

미들웨어는 함수들의 연속이다. Express에 기능을 추가해야 할 때에는 이 미들웨어의 형태로 추가할 수 있다.

### 미들웨어 예시

```javascript
const express = require('express');
const app = express();

function logger(req, res, next) {
  console.log('I am logger');
  next();
}

app.use(logger);

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
```

미들웨어를 사용할 때에는 `use()` 메서드에 사용할 미들웨어를 파라미터로 넣어준다.

미들웨어의 인터페이스는 정해져있다. 위의 예시에서 생성한 `logger`라는 임의의 미들웨어를 보면 총 세 개의 파라미터를 받고 있는 것을 볼 수 있는데, 이는 미들웨어의 정해진 인터페이스다. 첫 번째 파라미터는 요청(request)객체, 두 번째 파라미터는 응답(response)객체 그리고 세 번째 파라미터로 `next`를 받으며, 미들웨어는 해야 할 일을 마친 뒤에는 `next()`를 호출해야 한다. 그래야 다음 동작을 수행할 수 있다.

**참고:**

- [Express 미들웨어 작성](https://expressjs.com/ko/guide/writing-middleware.html)

### 미들웨어의 실행 순서

```javascript
const express = require('express');
const app = express();

function logger(req, res, next) {
  console.log('I am logger');
  // next();
}

function logger2(req, res, next) {
  console.log('I am logger2'); // -> 출력되지 않음
  next();
}

app.use(logger);
app.use(logger2);

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
```

만약 위와 같이 `logger` 내부에서 `next()`를 호출하지 않는다면, 서버에 오청 시 서버 콘솔에는 `I am logger`만 출력되고, 이후의 함수는 무시된다.

또한, 미들웨어는 `use()` 메서드를 통해 호출한 순서에 따라 실행된다. 따라서 아래와 같이 두 미들웨어의 호출 순서를 바꾼다면,

```javascript
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
```

서버 콘솔에는 `I am logger2`가 먼저 출력되고 이후에 `I am logger`가 출력되는 것을 확인할 수 있다.

### 에러 미들웨어

미들웨어는 **일반 미들웨어** 와 **에러 미들웨어** 로 구분할 수 있으며, 앞에서 만들어봤던 미들웨어와 npm을 통해 내려 받아 사용하는 서드파티 미들웨어는 모두 일반 미들웨어에 속한다.

일반 미들웨어는 `req, res, next` 세 개의 파라미터를 받지만, 에러 미들웨어는 `err, req, res, next` 네 개의 파라미터를 받는다.

```javascript
const express = require('express');
const app = express();

function commonMiddleware(req, res, next) {
  console.log('common middleware');
  next(new Error('what the error!')); // <- 인위적으로 에러객체 전달
}

function errorMiddleware(err, req, res, next) {
  console.log(err.message); // <- 전달 받은 에러객체의 메시지 출력 what the error!
  next(); // <- 만약 에러가 처리되지 않으면 next에 err을 담아 다음으로 넘길 수 있음
}

app.use(commonMiddleware);
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
```

위와 같이 일반 미들웨어에서 에러가 발생한 경우, 에러 미들웨어는 에러객체를 파라미터로 받아 처리하게 된다.

**참고:**

- [미들웨어 사용](https://expressjs.com/ko/guide/using-middleware.html)
- [에러 처리](https://expressjs.com/ko/guide/error-handling.html)

## 라우팅(with Express)

어떤 요청이 왔을 때 해당 요청에 맞는 응답을 해주는 것을 라우팅(Routing)이라고 한다. 앞에서 Node.js만 사용하여 구현했던 라우팅 코드를 다시 한 번 살펴보자.

```javascript
// without Express

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello Node');
  } else if (req.url === '/users') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('User List');
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

위와 같이 요청에 따른 조건들을 일일이 분기해줘야 하기 때문에 코드가 장황해지는 것이 불가피하다. 따라서 보다 간결하게 라우팅 처리를 하기 위해 Express.js를 활용한다. 정확하게는 Express.js의 어플리케이션 객체의 `get()`과 `post()` 등의 메서드다.

나아가 라우팅을 더욱 구조적으로 하고 싶다면, 전용 `Router` 클래스를 활용하면 좋다.

**참고:**

- [Really, really basic routing in Node.js with Express](https://www.freecodecamp.org/news/really-really-basic-routing-in-nodejs-with-express-d7cad5e3f5d5/)
- [Express 라우팅](https://expressjs.com/ko/guide/routing.html)

## 요청객체와 응답객체

요청객체는 **클라이언트에서 서버로 들어온 요청 정보를 담은 객체** 를 말하며, Express.js에서의 요청객체는 http 모듈의 request 객체를 래핑(Wrapping)한 것이다. 이를 통해 `req.params()`, `req.query()`, `req.body()` 등의 Express.js의 메서드를 손쉽게 활용 가능하다.

응답객체는 **서버에서 클라이언트로 전달하는 응답 정보를 담은 객체** 를 말하며, 마찬가지로 http 모듈의 response 객체를 래핑한 것이다. `res.send()`, `res.status()`, `res.json()` 등의 메서드가 주로 사용된다.

## Hello World in Express.js

```javascript
// 1. express 모듈 가져옴
const express = require('express');

// 2. express 객체를 생성하여 app 변수에 할당
const app = express();

// 4. GET 요청 시의 라우팅 설정.
// 첫 번째 파라미터로는 요청 경로, 두 번째 파라미터로는 실행할 콜백 함수
// 콜백 함수의 파라미터로는 요청객체와 응답객체가 들어옴
app.get('/', (req, res) => {
  res.send('Hello World'); // -> Hello World 문자열을 클라이언트로 전송
});

// 3. listen 함수를 통해 서버를 구동.
// 첫 번째 파라미터로는 포트 번호, 두 번째 파라미터로는 서버 구동 시 실행되는 콜백 함수
app.listen(3000, () => {
  console.log('server start');
});
```

## 요청 형식

모든 자원은 명사로 식별하며, HTTP 경로를 통해 자원을 요청한다. HTTP 메서드는 서버 자원에 대한 행동을 나타내며 동사로 표현한다.

### HTTP Method

- GET: 자원을 조회
- POST: 자원을 생성
- PUT: 자원을 갱신
- DELETE: 자원을 삭제

위의 메서드들은 모두 Express.js 어플리케이션의 메서드로 구현되어 있다.

```javascript
const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  res.send('this is users list');
});

app.listen(3000, () => {
  console.log('server start');
});
```

위와 같이 `/users` 요청에 대한 `get()` 라우팅이 존재할 때, `curl -X GET 'localhost:3000/users`를 통해 요청을 하면, `this is users list` 문자열이 응답으로 들어오는 것을 확인할 수 있다.

## 응답 형식

![status codes](https://amudabadmus.files.wordpress.com/2017/04/restful-web-services-with-spring-mvc-28-638.jpg)

**참고:**

- [HTTP status code](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)
