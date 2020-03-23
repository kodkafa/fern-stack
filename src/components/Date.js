import React from 'react';
import moment from "moment";

export const Date = (props) => {
  return (
    <span {...props}>
      {moment(props.date).format('YYYY-MM-DD HH:ss')}
    </span>
  );
};
