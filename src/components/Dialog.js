import React, {useCallback, useEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom'
import {Button} from './Button'
import {Modal} from 'bootstrap'
import {useTranslation} from 'react-i18next'

export const Dialog = ({
  className = '',
  title,
  children,
  cancelButtonText,
  confirmButtontext,
  show = true,
  onClose = () => null,
  onConfirm = () => null,
}) => {
  const {t} = useTranslation()
  const ref = useRef(null)
  const [element, setElement] = useState({show: () => null, hide: () => null})

  useEffect(() => {
    setElement(
      new Modal(ref.current, {
        //keyboard: true,
        scroll: true,
        backdrop: true,
      })
    )
  }, [ref])
  // element.show()
  console.log({show})
  if (show) element.show()
  else element.hide()

  const handleConfirm = useCallback(async () => {
    await onConfirm()
    element.hide()
    console.log('handleConfirm')
  }, [element, onConfirm])

  const handleClose = useCallback(async () => {
    await onClose()
    element.hide()
    console.log('handleClose')
  }, [element, onClose])

  const handleKeyboard = useCallback(
    async e => {
      console.log(e.key)
      if (e.key === 'Escape') {
        document.body.removeEventListener('keyup', handleKeyboard, false)
        await handleClose()
      }
      if (e.key === 'Enter' || e.key === ' ') {
        document.body.removeEventListener('keyup', handleKeyboard, false)
        await handleConfirm()
      }
    },
    [handleClose, handleConfirm]
  )

  useEffect(() => {
    document.body.addEventListener('keyup', handleKeyboard)
    return () => {
      console.log('handleCleanup')
      element.hide()
      document.body.removeEventListener('keyup', handleKeyboard, false)
    }
  }, [element, handleKeyboard])

  return (
    <div
      className={`modal fade ${className}`}
      tabIndex="-1"
      ref={ref}
      aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title || t('Confirmation')}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              data-bs-dismiss="modal">
              {cancelButtonText || t('Cancel')}
            </button>
            <Button className="btn btn-primary" onClick={onConfirm}>
              {confirmButtontext || t('Confirmation')}
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
