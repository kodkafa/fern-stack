import {inject, observer} from 'mobx-react'
import React from 'react'
import {Avatar} from 'components'
import {Link} from 'react-router-dom'

export const Item = inject('AuthStore')(
  observer(props => {
    const {id, data} = props
    const {isAdmin, isEditor} = props.AuthStore.me
    return (
      <div className="card" id={id}>
        <div className="row g-0">
          <div className="col-4">
            <Avatar
              className="img-thumbnail rounded-circle m-1"
              src={data.avatar}
              alt={data.name}
              width="100"
              height="100"
            />
          </div>
          <div className="col-8">
            <div className="card-body">
              <h3 className="h5 card-title text-truncate">
                <i className={data.icon} />
                &nbsp;&nbsp;{data.name}
              </h3>
              <p className="text-truncate">
                <small>{data.username}</small>
              </p>
              <div className="text-right">
                {data.uid && (
                  <Link
                    to={'/' + (data.username || id)}
                    className="btn btn-sm btn-primary">
                    PROFILE
                  </Link>
                )}
                {(isAdmin || isEditor) && (
                  <Link
                    to={'/users/' + id + '/edit'}
                    className="btn btn-sm btn-success ms-1">
                    EDIT
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  })
)
