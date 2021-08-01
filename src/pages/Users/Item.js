import {inject, observer} from 'mobx-react'
import React from 'react'
import {Avatar} from 'components'
import {Link} from 'react-router-dom'

export const Item = inject('AuthStore')(
  observer(props => {
    const {id, data} = props
    const {isAdmin, isEditor} = props.AuthStore.me
    return (
      <tr id={id}>
        <th scope="row">
          <Avatar
            className="img-thumbnail rounded-circle"
            src={data.avatar}
            alt={data.name}
            width="40"
            height="40"
          />
        </th>
        <td>{data.first}</td>
        <td>{data.last}</td>
        <td>
          {data.id && (
            <Link
              to={'/' + (data.username || id)}
              className="btn btn-sm btn-default">
              {data.username}
            </Link>
          )}
        </td>
        <td>{data.createdAt}</td>
        <td>{data.lastLogin}</td>
        <td>
          <i className={data.icon} />
        </td>
        <td>G</td>
        <td>{data.isUser ? 'Active' : 'Disabled'}</td>
        <td>
          {(isAdmin || isEditor) && (
            <Link
              to={'/users/' + id + '/edit'}
              className="btn btn-sm btn-success ms-1">
              <i className="fa fa-pencil-alt" aria-hidden="true" />
            </Link>
          )}
        </td>
      </tr>
    )
  })
)
