import React, {useEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom'
import {Button} from './Button'
import {Modal} from 'bootstrap'

export const Dialog = ({
  // title = 'Dialog',
  show,
  children,
  onClose = null,
  onConfirm = () => null,
  className = '',
  // scrollable = false
}) => {
  const ref = useRef(null)
  const [element, setElement] = useState({show: () => null, hide: () => null})

  useEffect(() => {
    setElement(
      new Modal(ref.current, {
        keyboard: true,
        scroll: true,
        backdrop: false,
      })
    )
  }, [ref])
  if (show) element.show()
  else element.hide()

  const handleClose = () => {
    if (onClose) onClose()
    element.hide()
    console.log('handleClose')
  }

  const escClose = e => {
    if (e.key === 'Escape') {
      handleClose()
      document.body.removeEventListener('keyup', escClose, false)
    }
  }

  useEffect(() => {
    document.body.addEventListener('keyup', escClose)
    return () => {
      document.body.removeEventListener('keyup', escClose, false)
    }
  })

  return (
    <div
      className={`modal fade ${className}`}
      tabIndex="-1"
      ref={ref}
      aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmation</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal">
              Close
            </button>
            <Button className="btn btn-primary" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const DialogTitle = props => (
  <div className="dialog-title">
    <h2>{props.children}</h2>
  </div>
)
export const DialogContent = props => (
  <div className="dialog-content">{props.children}</div>
)
export const DialogFooter = props => (
  <div className="dialog-footer">{props.children}</div>
)

export const Portal = props =>
  ReactDOM.createPortal(
    <Dialog {...props} />,
    document.getElementById('floating-window')
  )
