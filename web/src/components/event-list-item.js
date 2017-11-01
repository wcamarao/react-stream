/**
 * Dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './event-list-item.css';

/**
 * EventListItem Presentation Component
 */
class EventListItem extends Component {

  /**
   * Render an event item as a list element
   */
  render() {
    return (
      <li className="list-group-item">
        <div className="event-type">{this.props.event.type}</div>
        <div className="event-message">{this.props.event.message}</div>
      </li>
    );
  }
}

/**
 * Define property types
 */
EventListItem.propTypes = {
  event: PropTypes.object.isRequired
};

/**
 * Export component
 */
export default EventListItem;
