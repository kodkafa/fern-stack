import React from 'react';

export const Submit = React.forwardRef((props, ref) => {
  const {loading} = props
  return <button className={"btn btn-primary " + props.className}
                 type="submit"
                 disabled={loading}
                 ref={ref}
  >
    {loading && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
    {props.name || props.children}
  </button>
})
