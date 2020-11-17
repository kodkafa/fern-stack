import React, {useState} from 'react'

export const ToggleButton = React.forwardRef((props, ref) => {
  const {
    textActive = props.children,
    textPassive = props.children,
    classActive = 'btn btn-default text-primary',
    classPassive = 'btn btn-default',
    iconActive = props.icon || 'fa fa-check',
    iconPassive = props.icon || 'fa fa-times',
    iconLoading = 'fa fa-circle-notch fa-spin',
    status,
  } = props

  const [loading, setLoading] = useState(false)

  const onClick = async e => {
    e.preventDefault()
    setLoading(true)
    await props.toggleFunction(e)
    setLoading(false)
  }

  //console.log('status', status, this.props.toggleFunction);
  const text = status ? textActive : textPassive
  const className = status ? classActive : classPassive
  const icon = loading ? iconLoading : status ? iconActive : iconPassive
  return (
    <button
      {...props}
      style={{...props.style}}
      ref={ref}
      className={className + ' ' + props.className}
      onClick={onClick}>
      <i className={icon} /> {text}
    </button>
  )
})
