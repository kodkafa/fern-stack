import React from 'react'
import loader from '../assets/img/loading.svg'

export const Loader = ({background = null}) => (
  <div className={'loader ' + (background && 'background')}>
    <img width={80} height="auto" src={loader} alt="loading" />
  </div>
)
