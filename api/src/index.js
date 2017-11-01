/**
 * Dependencies
 */
import App from './app';
import Redis from 'ioredis';

/**
 * Server configuration
 */
const THROTTLE_WAIT = 2000;
const SERVER_PORT = 8080;

/**
 * Initialize the server
 */
const app = new App();
app.configure(new Redis(), THROTTLE_WAIT);
app.run(SERVER_PORT);
