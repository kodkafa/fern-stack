import React, {useEffect, useState} from 'react';
import firebase from "firebase/app";

const ImageViewer = (props) => {
  console.log("PROPS", props)
  const [src, setSrc] = useState(null);
  const placeholder = props.placeholder === undefined ? `http://holder.ninja/${props.width || 100}x${props.height || 100}.svg` :
    props.placeholder;
  const isACorrectSrc = (src) => {
    return !(!src || src === 'undefined' || src === 'undefined.png' || typeof src === 'object')
  };

  useEffect(() => {
    if (isACorrectSrc(props.src)) {
        firebase.storage().ref('images')
          .child(props.src).getDownloadURL()
          .then(
            url => {
              const image = new Image();
              image.onload = () => {
                setSrc(url)
              };
              image.src = url;
            }
          );
    }
  });

  return (
    isACorrectSrc(props.src)
      ? src
      ? <img {...props} src={src} alt={props.alt || "such a nice image without an alt text"}/>
      : (props.width || props.height)
        ? <svg {...props} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
               viewBox={`0 0 ${props.width} ${props.height}`}>
          <defs>
            <linearGradient id="flow" x1="100%" y1="100%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E1E3E4" stopOpacity="1">
                <animate
                  attributeName="stop-color"
                  values="#e1e3e4;#e1e3e4;#b1b3b4;#e1e3e4;#e1e3e4;"
                  keyTimes="0;.25;.5;.75;1"
                  dur="2s"
                  repeatCount="indefinite"/>
              </stop>
            </linearGradient>
          </defs>
          <rect fill="url(#flow)" stroke="#888" strokeOpacity=".5" strokeWidth="1" width={props.width}
                height={props.height}/>
        </svg> : null
      : placeholder
      ? <img {...props} src={placeholder} alt={props.alt || "such a nice image without an alt text"}/>
      : null);

};

export default ImageViewer
