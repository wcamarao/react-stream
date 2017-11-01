'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ioredis = require('ioredis');

var _ioredis2 = _interopRequireDefault(_ioredis);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var redis = new _ioredis2.default(); /**
                                      * Publish 300 events per second
                                      * to redis using random data
                                      */


var logger = new _winston2.default.Logger({
  transports: [new _winston2.default.transports.Console({
    timestamp: function timestamp() {
      return new Date().toString();
    },
    colorize: true
  })]
});

redis.on('connect', function () {
  publish();
});

redis.on('error', function (err) {
  logger.error(err);
  process.exit(1);
});

function publish() {
  logger.debug('Publishing 300 events to redis');

  _lodash2.default.times(300, function () {
    redis.publish('events', createEvent());
  });

  _lodash2.default.delay(publish, 1000);
}

function createEvent() {
  return JSON.stringify({
    uuid: (0, _uuid2.default)(),
    type: _faker2.default.hacker.abbreviation() + '/' + _faker2.default.system.semver(),
    message: _faker2.default.hacker.phrase()
  });
}