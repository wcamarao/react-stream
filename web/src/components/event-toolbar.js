/**
 * Dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './event-toolbar.css';

/**
 * EventToolbar Presentation Component
 */
class EventToolbar extends Component {
  render() {
    return (
      <div className="event-toolbar form-inline">
        <button
          className="event-pause-resume btn btn-primary"
          onClick={this.props.onToggleStream}>
          {this.props.isStreamActive ? 'Pause' : 'Resume'}
        </button>

        <span className="event-count">
          Showing {this.props.displayCount}/{this.props.totalCount} events
        </span>

        <div className="event-filter-wrapper pull-right">
          <span
            className="event-filter-icon glyphicon glyphicon-search"
            aria-hidden="true"></span>

          <input
            className="event-filter"
            placeholder="Filter"
            onChange={event => this.props.onFilterChange(event.target.value)} />
        </div>
      </div>
    );
  }
}

/**
 * Define property types
 */
EventToolbar.propTypes = {
  onToggleStream: PropTypes.func.isRequired,
  isStreamActive: PropTypes.bool.isRequired,
  displayCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

/**
 * Export component
 */
export default EventToolbar;
