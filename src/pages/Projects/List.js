import {inject, observer} from 'mobx-react'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useNavigate, useLocation} from 'react-router-dom'
import {Item} from './Item'
import qs from 'qs'
import {Button} from '../../components'
import {NoData} from '../../components/NoData'

export const List = inject(
  'AuthStore',
  'ProjectStore'
)(
  observer(props => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const {search} = useLocation()
    const {search: q} = {...qs.parse(search, {ignoreQueryPrefix: true})}
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState(q)

    const handleFilter = e => setQuery(e.currentTarget.value.toLowerCase())
    const handleSearch = e => e.key === 'Enter' && navigate('?search=' + query)

    const {list, read} = props.ProjectStore
    useEffect(() => {
      read({q}).then(() => {
        setLoading(false)
      })
    }, [read, q])

    const handleGetMore = async () => {
      // if (
      //   window.innerHeight + document.documentElement.scrollTop ===
      //   document.scrollingElement.scrollHeight
      // )
      await read({more: true}).then(() => {
        setLoading(false)
      })
    }

    // useEffect(() => {
    //   window.addEventListener('scroll', readMore)
    //   return () => {
    //     window.removeEventListener('scroll', readMore)
    //   }
    // })

    console.log({list, query})
    const filteredList = list.filter(
      i => !query || (i.name || '').toLowerCase().indexOf(query) > -1
    )

    return loading ? (
      <div>{t('Loading...')}</div>
    ) : (
      <React.Fragment>
        <div className="list">
          <div className="row pb-2">
            <div className="col-3 gx-3">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="filter & search ..."
                value={query}
                onChange={handleFilter}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
          <div className="row g-2">
            {filteredList.map(i => (
              <Item key={i.id} id={i.id} data={i} />
            ))}
          </div>
          <div className="row g-2 pt-2">
            {!!filteredList.length && (
              <Button className="btn btn-primary" onClick={handleGetMore}>
                Get More
              </Button>
            )}
            {!filteredList.length && <NoData />}
          </div>
        </div>
      </React.Fragment>
    )
  })
)
