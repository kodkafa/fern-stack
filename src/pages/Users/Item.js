import {inject, observer} from 'mobx-react'
import React from 'react'
import {Avatar} from 'components'
import {Link} from 'react-router-dom'

export const Item = inject('AuthStore')(
  observer(props => {
    const {id, data} = props
    const {isAdmin, isEditor} = props.AuthStore.me
    return (
      <div className="col-sm-4" id={id}>
        <div className="card mb-2">
          <div className="card-body p-2">
            <Avatar
              className="img-thumbnail rounded-circle float-left mr-2"
              src={data.avatar}
              alt={data.name}
              width="100"
              height="100"
            />
            <div className="">
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
                    to={'/' + (data.username || data.uid)}
                    className="btn btn-sm btn-primary">
                    PROFILE
                  </Link>
                )}
                {(isAdmin || isEditor) && (
                  <Link
                    to={'/users/' + data.uid + '/edit'}
                    className="btn btn-sm btn-success ml-1">
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
