/**
 * Dependencies
 */
import React from 'react';
import ReactDOM from 'react-dom';
import EventStream from './containers/event-stream';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

/**
 * Render EventStream to root DOM element
 */
ReactDOM.render(<EventStream />, document.getElementById('root'));
registerServiceWorker();
