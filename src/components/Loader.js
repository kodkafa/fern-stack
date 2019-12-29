import React from 'react';

export const Loader = (props) => {
  return <div className="loader">
    <div {...props} className="fa-3x">
      <i className="fas fa-circle-notch fa-spin"/></div>
  </div>;
};
