import React from 'react'

export function Submit({label, children, loading, icon, className, ...rest}) {
  return (
    <button
      className={'btn btn-primary w-100 ' + className}
      type="submit"
      disabled={loading}
      {...rest}>
      {loading && (
        <span>
          <i className="fa fa-circle-notch fa-spin" />
          &nbsp;
        </span>
      )}
      {!loading && icon && (
        <span>
          <i className={icon} />
          &nbsp;
        </span>
      )}
      {label || children}
    </button>
  )
}
