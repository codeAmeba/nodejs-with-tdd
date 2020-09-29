# TDD로 만드는 Node.js API 서버

- [인프런 | 테스트주도개발(TDD)로 만드는 NodeJS API 서버](https://www.inflearn.com/course/%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%A3%BC%EB%8F%84%EA%B0%9C%EB%B0%9C-tdd-nodejs-api/dashboard)

## 환경

- Node.js
- VSCode
- Terminal

## Node.js 기본 개념

- Node.js는 브라우저 밖에서 자바스크립트 코드를 실행할 수 있도록 해주는 실행환경
- 크롬의 V8 엔진(자바스크립트 코드 해석기)이 내장되어 있음
- 이벤트 기반의 비동기 I/O 프레임워크
- CommonJS를 구현한 모듈 시스템

## 이벤트 기반의 비동기 I/O 프레임워크

![](https://miro.medium.com/max/982/1*xm_WajiPlaOeJWcqgJb1xQ.png)

클라이언트에서 요청(request)을 보내면, Node.js는 이 요청을 이벤트로 만들어 이벤트 큐(Queue)에 넣는다. 그리고 이벤트 루프(Event Loop)는 이벤트 큐의 이벤트를 하나씩 꺼내 실행하는데, 이벤트 루프는 싱글스레드이기 때문에 한 번에 하나의 이벤트만 실행하며, 실행된 이벤트는 클라이언트로 응답(response)의 형태로 전달된다.

이때, 이벤트 루프를 거쳐 즉시 응답될 수 있는 이벤트가 있는 반면에 비교적 긴 시간이 소요되는 이벤트도 있다. 이러한 것들까지 이벤트 루프에서 실행하려 하면 블로킹이 걸리기 때문에 이럴 때에는 다른 쓰레드(worker)에게 이벤트를 위임하게 된다. 이벤트를 위임받은 worker는 이벤트 루프와는 별개로 이벤트를 처리한 뒤 결과만 이벤트 큐에 다시 돌려준다.

