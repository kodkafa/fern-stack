import React, {useEffect, useRef} from 'react'

export const CoverEditor = ({image, width, height}) => {
  const ref = useRef(null)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.onload = async () => {
    ctx.drawImage(img, 0, 0)
    // const image = await fetch(canvas.toDataURL())
    //   .then(res => res.blob())
  }
  img.src = image
  useEffect(() => {
    if (ref) ref.current.innerHTML = canvas
  }, [ref, canvas])
  return <div ref={ref} />
}
