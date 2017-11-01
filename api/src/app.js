/**
 * Dependencies
 */
import _ from 'lodash';
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import winston from 'winston';

/**
 * Socket server integrated with redis stream
 */
class App {

  /**
   * Wire up dependencies and initial state
   * @param {*} redis IORedis instance
   * @param {*} throttleWait Time between event emissions (ms)
   */
  configure(redis, throttleWait) {
    this.expressApp = express();
    this.httpServer = http.Server(this.expressApp);
    this.io = socketIO(this.httpServer);
    this.redis = redis;
    this.throttleWait = throttleWait;

    this.activeSockets = [];
    this.pendingEvents = [];

    this.createLogger();
    this.handleSockets();
    this.subscribeToEvents();
    this.createThrottler();
    this.handleMessages();
    this.handleError();
  }

  /**
   * Logger
   */
  createLogger() {
    this.logger = new winston.Logger({
      transports: [
        new winston.transports.Console({
          timestamp: () => new Date().toString(),
          colorize: true,
        })
      ]
    });
  }

  /**
   * Keep list of active sockets
   */
  handleSockets() {
    this.io.on('connection', (socket) => {
      this.activeSockets.push(socket);
      this.logger.info('Socket connected. Active sockets:', this.activeSockets.length);

      socket.on('disconnect', () => {
        this.activeSockets.splice(this.activeSockets.indexOf(socket), 1);
        this.logger.info('Socket disconnected. Active sockets:', this.activeSockets.length);
      });
    });
  }

  /**
   * Subscribe to events stream
   */
  subscribeToEvents() {
    this.redis.subscribe('events', (err, count) => {
      if (err) {
        this.logger.error('Failed subscribing to events stream', err);
        return;
      }

      if (count !== 1) {
        this.logger.warn('Unexpected number of subscribed channels', count);
      }
    });
  }

  /**
   * Create throttler for event emissions
   */
  createThrottler() {
    this.emitPendingEvents = _.throttle(() => {
      if (this.pendingEvents.length === 0) {
        return;
      }

      this.logger.info('Emitting %d events to %d sockets',
        this.pendingEvents.length,
        this.activeSockets.length);

      _.each(this.activeSockets, (socket) => {
        socket.emit('events', this.pendingEvents);
      });

      this.pendingEvents.splice(0, this.pendingEvents.length);
    }, this.throttleWait);
  }

  /**
   * Keep clients updated with events
   */
  handleMessages() {
    this.redis.on('message', (channel, message) => {
      if (channel !== 'events') {
        this.logger.warn('Unexpected message to channel', channel, message);
        return;
      }

      this.emitPendingEvents();
      this.pendingEvents.unshift(JSON.parse(message));
    });
  }

  /**
   * Keep clients updated with errors
   */
  handleError() {
    this.redis.on('error', (error) => {
      this.logger.error('Redis', error);

      _.each(this.activeSockets, (socket) => {
        socket.emit('error', error);
      });
    });
  }

  /**
   * Run the server at the specified port
   * @param {*} port Server port
   */
  run(port) {
    this.httpServer.listen(port);
    this.logger.info('Server initialized on port', port);
  }
}

/**
 * Export module
 */
export default App;
