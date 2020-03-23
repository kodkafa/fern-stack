import React from 'react';
import {ImageViewer} from './ImageViewer'
import avatar from "../assets/img/avatar.svg"

export const Avatar = (props) => {
  const checkSrc = (src) => {
    return (!src || src === 'undefined' || src === 'undefined.png' || typeof src === 'object')
  };
  const src = checkSrc(props.src) ? avatar : null;
  return <ImageViewer {...props} placeholder={src}/>
};

