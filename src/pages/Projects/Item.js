import {inject, observer} from 'mobx-react'
import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'components'

export const Item = inject(
  'AuthStore',
  'ProjectStore'
)(
  observer(props => {
    const {id, data} = props
    const {isAdmin, isEditor} = props.AuthStore.me

    const handleDelete = async () => await props.ProjectStore.delete(id)

    return (
      <div id={id} className="card">
        <div className="card-body">
          <h3 className="h5 card-title text-truncate">{data.name}</h3>
          <p className="text-truncate">
            <small>{String(data.createdAt)}</small> -{' '}
            <small>{String(data.updatedAt)}</small>
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
            {(isAdmin || isEditor) && (
              <Button
                className="btn btn-sm btn-alert ms-1"
                confirm="Are you sure?"
                onClick={handleDelete}>
                DELETE
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  })
)
