import _ from 'lodash';
import { expect } from 'chai';
import sinon from 'sinon';
import io from 'socket.io-client';
import App from '../src/app';

describe('App', function () {
  let app, redis, socket;

  before(function () {
    redis = sinon.stub({
      subscribe: (channels, callback) => callback(null, 1),
      on: () => {}
    });

    app = new App();
    app.configure(redis, 5);
    sinon.stub(app.logger);
    app.run(8081);
  });

  beforeEach(function (done) {
    socket = io.connect('http://localhost:8081');
    socket.on('connect', done);
  });

  afterEach(function () {
    socket.close(function () {
      expect(app.activeSockets.length).to.eql(0);
    });
  });

  after(function () {
    app.httpServer.close();
  });

  describe('initialization', function () {
    it('wires up dependencies', function () {
      expect(app.expressApp).to.be.an.instanceof(Function);
      expect(app.httpServer).to.be.an.instanceof(Object);
      expect(app.io).to.be.an.instanceof(Object);
      expect(app.redis).to.eql(redis);
      expect(app.throttleWait).to.eql(5);
    });

    it('initializes state', function () {
      expect(app.activeSockets).to.be.an.instanceof(Array);
      expect(app.pendingEvents).to.be.an.instanceof(Array);
      expect(app.activeSockets.length).to.eql(1);
      expect(app.pendingEvents.length).to.eql(0);
    });

    it('creates logger', function () {
      expect(app.logger).to.respondTo('error');
      expect(app.logger).to.respondTo('info');
      expect(app.logger).to.respondTo('warn');
    });

    it('subscribes to events channel', function () {
      expect(redis.subscribe.withArgs('events').calledOnce).to.be.true;
    });

    it('creates throttler', function () {
      expect(app.emitPendingEvents).to.be.an.instanceof(Function);
    });

    it('handles redis messages', function () {
      expect(redis.on.withArgs('message').calledOnce).to.be.true;
      expect(redis.on.withArgs('error').calledOnce).to.be.true;
    });
  });

  describe('when there are no pending events', function () {
    it('does not emit socket events', function (done) {
      const mock = sinon.mock(app.activeSockets[0]).expects('emit').withArgs('events').never();
      app.emitPendingEvents();

      _.debounce(function () {
        mock.verify();
        mock.restore();
        done();
      }, 10)();
    });
  });

  describe('when there are pending events', function () {
    before(function () {
      app.pendingEvents.push({type: 'message'});
    });

    it('throttles emission of socket events', function (done) {
      const mock = sinon.mock(app.activeSockets[0]).expects('emit').withArgs('events').once();
      expect(app.pendingEvents.length).to.eql(1);
      app.emitPendingEvents();
      app.emitPendingEvents();

      _.debounce(function () {
        expect(app.pendingEvents.length).to.eql(0);
        mock.verify();
        mock.restore();
        done();
      }, 10)();
    });
  });
});
