import React from 'react'
import ReactDatePicker from 'react-datepicker'
import {Controller} from 'react-hook-form'

export const DatePicker = props => {
  const errors = props.errors || {}
  const messages = props.messages || {}
  return (
    <fieldset className={'form-group ' + props.className}>
      {props.label && <label>{props.label}</label>}
      <Controller
        as={
          <ReactDatePicker
            className="form-control"
            startDate={props.startDate || new Date()}
            endDate={props.endDate || new Date()}
            dateFormat={props.dateFormat || 'd MMM yyyy'}
            placeholderText={props.placeholder}
          />
        }
        control={props.control}
        register={props.register}
        name={props.name || 'date'}
        valueName="selected"
        defaultValue={props.defaultValue}
        onChange={([selected]) => {
          return selected
        }}
      />
      {errors[props.name] && (
        <small className="form-text text-danger">
          {messages[errors[props.name].type] || errors[props.name].message}
        </small>
      )}
    </fieldset>
  )
}
