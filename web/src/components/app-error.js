/**
 * Dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './app-error.css';

/**
 * AppError Presentation Component
 */
class AppError extends Component {

  /**
   * Render error element
   */
  render() {
    if (!this.props.error) {
      return null;
    }

    return (
      <div className="app-error">{this.props.error}</div>
    );
  }
}

/**
 * Define property types
 */
AppError.propTypes = {
  error: PropTypes.string.isRequired
};

/**
 * Export component
 */
export default AppError;
