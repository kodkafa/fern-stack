import React from 'react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

export const NoData = ({className = '', children}) => {
  const {t} = useTranslation()
  return (
    <div
      className={`card text-center p-3 p-lg-5 text-colorize-gray ${className}`}>
      <div className="card-body">
        {children || (
          <React.Fragment>
            <h5 className="card-title">{t('No records found')}</h5>
            <p>
              {t(
                'If using a custom view, try adjusting the filters. Otherwise, create some data!'
              )}
            </p>
            <Link className="btn btn-primary px-5" to="add">
              {t('Add')}
            </Link>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
