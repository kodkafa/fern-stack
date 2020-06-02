import React from 'react';

export const Input = React.forwardRef((props, ref) => {
  const errors = props.errors || {};
  const messages = props.messages || {};
  return <fieldset className={"form-group " + props.className}>
    {props.label && <label>{props.label}</label>}
    <input className="form-control"
           type={props.type || 'text'}
           name={props.name}
           placeholder={props.placeholder}
           defaultValue={props.defaultValue}
           ref={ref}
    />
    {errors[props.name] &&
    <small className="form-text text-danger">
      {messages[errors[props.name].type] || errors[props.name].message}
    </small>}
  </fieldset>
})
