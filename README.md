# react-stream

Experimental project for learning React and Redux, featuring a resilient, message-driven architecture.

## Features

* **All event-based** via sockets and redis pub/sub
* **Ephemeral state** for load testing react and redux
* **Server throttling** for reduced network traffic
* **300 events/second** or as defined in source

## System Components

* **api -** Socket server integrated with redis stream (http:8080)
* **web -** Socket client integrated with react redux (http:3000)
* **redis -** Public redis image from docker hub (tcp:6379)
* **stream -** Service worker to publish events to redis

## System Dependencies

* docker-compose: ^1.16.1
* node: ^8.1.2
* npm: ^5.5.1

## Quick Start

Install dependencies for all system components:

```
npm run build
```

Run all system components concurrently:

```
npm start
```

Run tests for **api** and **web**:

```
npm test
```

## System Components

Each system component has its own set of scripts.

### redis

* Runs on tcp:6379

Available commands (project root):

* `docker-compose up`

### api

* Runs on http:8080
* Requires **redis** to be running

Available commands (./api):

* `npm install`
* `npm run build`
* `npm test`
* `npm run watch`
* `npm start`

### web

* Runs on http:3000
* Requires **api** to be running

Available commands (./web):

* `npm install`
* `npm run build`
* `npm test`
* `npm run watch`
* `npm start`

### stream

* Requires **redis** to be running

Available commands (./stream):

* `npm install`
* `npm run build`
* `npm start`

## TODO

Refactor UI state management to use Redux.

## License

https://wcamarao.mit-license.org
