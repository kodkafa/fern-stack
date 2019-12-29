import React from 'react';

export const Affix = (props = {
  top: 0,
  children: null,
  offset: 0,
  className: null
}) => {

  const oldStyles = {
    position: '',
    top: '',
  };

  let scrollEvent = null;

  const checkPosition = (element, distanceToBody = 0) => {
    const scrollTop = window.scrollY;
    if (distanceToBody - scrollTop < props.top) {
      if (element.style.position !== 'fixed') {
        for (let key in oldStyles) {
          oldStyles[key] = element.style[key];
        }
        element.style.position = 'fixed';
        element.style.top = props.top + 'px';
        element.className += ' affixed'
      }
    } else {
      // reset to default
      for (let key in oldStyles) {
        element.style[key] = oldStyles[key];
      }
      element.className = element.className.replace(' affixed', '')
    }
  };

  const setRef = (element) => {
    if (!element || typeof window.scrollY === 'undefined') return;
    const distanceToBody = window.scrollY + element.offsetTop + props.offset;
    const handleScroll = () => {
      checkPosition(element, distanceToBody);
    };
    if (!scrollEvent) {
      console.log('scroll event added ');
      window.addEventListener('scroll', handleScroll);
    }
  };

  return (
    <div ref={setRef} style={{zIndex: 1}} className={"affix " + props.className}>
      {props.children}
    </div>
  );
}
