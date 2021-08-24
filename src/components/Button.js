import React, {useEffect, useState} from 'react'
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
  loaderIcon = (
    <div className="spinner-border spinner-border-sm text-light" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  ),
  type = 'button',
  ...props
}) => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(_loading)
  //const {dispatch = _ => null} = useContext(ContextStore)

  const handleConfirm = e => {
    e.preventDefault()
    e.stopPropagation()
    setShow(true)
    // dispatch(true)
  }
  //
  // const handleClose = () => open && setOpen(false)

  const handleClick = async e => {
    setLoading(true)
    onClick
      ? await onClick(e)
      : await (async e =>
          props.type === 'submit'
            ? e.target.closest('form').dispatchEvent(new Event('submit'))
            : true)(e)
    //setShow(false)
    setLoading(false)
    // handleClose()
    // if (onComplete) onComplete(r)
  }

  useEffect(() => {
    return () => {
      setLoading(false)
      setShow(false)
    }
  }, [])

  const textPaddingClass =
    (_loading || loading || icon) && (label || children) && 'pe-2'

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
      {confirm && show && (
        <Dialog
          show={show}
          onConfirm={handleClick}
          onClose={() => setShow(false)}>
          {confirm}
        </Dialog>
      )}
    </React.Fragment>
  )
}
