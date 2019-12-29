import React from 'react';
import moment from "moment-timezone";

export const Date = (props) => {
  return (
    <span {...props}>
      {moment(props.date).tz('Turkey').format('YYYY-MM-DD HH:ss')}
    </span>
  );
};
