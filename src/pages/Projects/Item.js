import {inject, observer} from 'mobx-react'
import React from 'react'
import {Link} from 'react-router-dom'

export const Item = inject('AuthStore')(
  observer(props => {
    const {id, data} = props
    const {isAdmin, isEditor} = props.AuthStore.me
    return (
      <div id={id} className="card">
        <div className="card-body">
          <h3 className="h5 card-title text-truncate">{data.name}</h3>
          <p className="text-truncate">
            <small>{data.createdAt}</small> - <small>{data.updatedAt}</small>
          </p>
          <p className="text-truncate">{data.content}</p>
          <div className="text-right">
            {(isAdmin || isEditor) && (
              <Link
                to={'/projects/' + id + '/edit'}
                className="btn btn-sm btn-success ms-1">
                EDIT
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  })
)