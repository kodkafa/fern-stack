import React, {useContext, useState} from 'react'
import {Dialog} from './Dialog'

export const Button = ({
  size,
  loading: _loading = false,
  confirm,
  onComplete = null,
  onClick = null,
  className = '',
  label = '',
  children,
  icon,
  loaderIcon = <i className="icon-spinner block animate-spin " />,
  type = 'button',
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(_loading)
  //const {dispatch = _ => null} = useContext(ContextStore)

  const handleConfirm = e => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
    // dispatch(true)
  }

  const handleClose = () => open && setOpen(false)

  const handleClick = async e => {
    setLoading(true)
    const r = onClick
      ? await onClick(e)
      : await (async e =>
          props.type === 'submit'
            ? e.target.closest('form').dispatchEvent(new Event('submit'))
            : true)(e)
    setLoading(false)
    handleClose()
    // if (onComplete) onComplete(r)
  }

  const textPaddingClass = (label || children) && 'pr-2'

  return (
    <React.Fragment>
      <button
        disabled={_loading || loading}
        {...props}
        onClick={confirm ? handleConfirm : handleClick}
        type={type}
        className={`btn ${className}`}>
        <span className={textPaddingClass}>
          {_loading || loading ? loaderIcon : icon}
        </span>
        {label || children}
      </button>
      {confirm && (
        <Dialog show={open} onConfirm={handleClick} onClose={handleClose}>
          {confirm}
        </Dialog>
      )}
    </React.Fragment>
  )
}
