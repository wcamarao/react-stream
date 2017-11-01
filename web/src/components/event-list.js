/**
 * Dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EventToolbar from './event-toolbar';
import EventListItem from './event-list-item';
import './event-list.css';

/**
 * EventList Presentation Component
 */
class EventList extends Component {

  /**
   * Render toolbar and list of events
   */
  render() {
    return (
      <div className="event-list">
        <EventToolbar
          onToggleStream={this.props.onToggleStream}
          onFilterChange={this.props.onFilterChange}
          displayCount={this.props.events.length}
          totalCount={this.props.totalCount}
          isStreamActive={this.props.isStreamActive} />

        <ul className="list-group">
          {this.props.events.map(this.renderEventListItem)}
        </ul>
      </div>
    );
  }

  /**
   * Render event list item
   * @param {*} event
   */
  renderEventListItem(event) {
    return <EventListItem
      key={event.id}
      event={event} />;
  }
}

/**
 * Define property types
 */
EventList.propTypes = {
  onToggleStream: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  isStreamActive: PropTypes.bool.isRequired,
  events: PropTypes.array.isRequired
};

/**
 * Export component
 */
export default EventList;
