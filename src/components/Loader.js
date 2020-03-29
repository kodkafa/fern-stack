import {inject, observer} from "mobx-react";
import React from 'react';

export const Loader = inject('UIStore')(observer((props) => {
  const {height} = props.UIStore;
  return <div className="loader" style={{height}}>
    <div {...props} className="fa-3x">
      <i className="fas fa-circle-notch fa-spin"/></div>
  </div>;
}));
