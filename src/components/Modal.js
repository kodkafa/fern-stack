import React, {useEffect, useRef, useState} from 'react'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'

export function Modal({title = '', children, footer = null, show}) {
  const ref = useRef(null)
  const [modal, setModal] = useState({show: () => null, hide: () => null})

  useEffect(() => {
    setModal(
      new bootstrap.Modal(ref.current, {
        keyboard: false,
      })
    )
  }, [ref])
  if (show) modal.show()
  else modal.hide()

  return (
    <div
      className="modal fade "
      id="modal"
      data-backdrop="static"
      data-keyboard="true"
      tabIndex="-1"
      ref={ref}
      aria-labelledby="modalLabel"
      aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalLabel">
              {title}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{children}</div>
          {footer}
        </div>
      </div>
    </div>
  )
}
