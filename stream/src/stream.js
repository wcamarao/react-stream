/**
 * Publish 300 events per second
 * to redis using random data
 */
import _ from 'lodash';
import Redis from 'ioredis';
import uuid from 'uuid';
import faker from 'faker';
import winston from 'winston';

const redis = new Redis();

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: () => new Date().toString(),
      colorize: true,
    })
  ]
});

redis.on('connect', () => {
  publish();
});

redis.on('error', (err) => {
  logger.error(err);
  process.exit(1);
});

function publish() {
  logger.debug('Publishing 300 events to redis');

  _.times(300, () => {
    redis.publish('events', createEvent());
  });

  _.delay(publish, 1000);
}

function createEvent() {
  return JSON.stringify({
    uuid: uuid(),
    type: `${faker.hacker.abbreviation()}/${faker.system.semver()}`,
    message: faker.hacker.phrase()
  });
}
