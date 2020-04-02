import React from 'react';
import loader from "../assets/img/loading.svg";

export const Loader =props => {
  const height = props.height || 'auto';
  return <div className={'loader ' + (props.background ? 'background' : '')} style={{height}}>
    <img width={80} height="auto" src={loader} alt="loading"/>
  </div>;
};
