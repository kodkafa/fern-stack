import React, {useEffect, useRef, useState} from 'react'
import {Offcanvas} from 'bootstrap'
import {useNavigate} from 'react-router-dom'

export function SlideOver({title = '', children, show = true, className = ''}) {
  const ref = useRef(null)
  const navigate = useNavigate()
  const [element, setElement] = useState({
    show: () => null,
    hide: () => null,
  })

  useEffect(() => {
    setElement(
      new Offcanvas(ref.current, {
        keyboard: true,
        scroll: true,
        backdrop: false,
      })
    )
    ref.current.addEventListener('hidden.bs.offcanvas', () => {
      navigate('..')
    })
  }, [ref, navigate])

  if (show) element.show()
  else element.hide()

  return (
    <div
      className={`offcanvas offcanvas-end shadow ${className}`}
      style={{paddingTop: 62}}
      tabIndex="-1"
      ref={ref}
      aria-labelledby="offcanvasLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasLabel">
          {title}
        </h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <div className="offcanvas-body">{children}</div>
    </div>
  )
}
