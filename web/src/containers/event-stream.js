/**
 * Dependencies
 */
import _ from 'lodash';
import React, { Component } from 'react';
import AppError from '../components/app-error';
import EventList from '../components/event-list';
import openSocket from 'socket.io-client';

const SOCKET_ENDPOINT = 'http://localhost:8080';
const MAX_EVENTS = 100;

/**
 * EventStream Container Component
 */
class EventStream extends Component {

  /**
   * Initialize state
   */
  constructor() {
    super();

    // Dependency injection for testing
    this.openSocket = openSocket;

    this.state = {
      isStreamActive: true,
      filterValue: '',
      events: []
    };
  }

  /**
   * Enable streaming when component is ready
   */
  componentDidMount() {
    this.activateSocket();
  }

  /**
   * Render list of events and potential errors
   */
  render() {
    return (
      <div>
        <AppError error={this.state.error} />

        <EventList
          onToggleStream={() => this.toggleStream()}
          onFilterChange={(filterValue) => this.updateFilter(filterValue)}
          totalCount={this.state.events.length}
          isStreamActive={this.state.isStreamActive}
          events={this.filteredEvents()} />
      </div>
    );
  }

  /**
   * Pause/Resume event stream
   */
  toggleStream() {
    const isStreamActive = !this.state.isStreamActive;
    isStreamActive ? this.activateSocket() : this.socket.close();
    this.setState({ isStreamActive });
  }

  /**
   * Enable displaying of upcoming events/errors
   */
  activateSocket() {
    this.socket = this.openSocket(SOCKET_ENDPOINT);

    this.socket.on('events', (events) => {
      this.setState({
        events: events.concat(this.state.events),
        error: null
      });
    });

    this.socket.on('connect_error', () => {
      this.setState({ error: 'Server unavailable' });
    });

    this.socket.on('error', () => {
      this.setState({ error: 'Server error' });
    });
  }

  /**
   * Update state with applied filter value
   * @param {*} filterValue
   */
  updateFilter(filterValue) {
    this.setState({ filterValue });
  }

  /**
   * Returns a new list of events with applied filter value,
   * limiting up to max events
   */
  filteredEvents() {
    return _.filter(this.state.events, (event) => {
      const lowerFilterValue = this.state.filterValue.toLowerCase();

      return event.type.toLowerCase().includes(lowerFilterValue) ||
             event.message.toLowerCase().includes(lowerFilterValue);
    }).slice(0, MAX_EVENTS);
  }
}

/**
 * Export component
 */
export default EventStream;
