import {inject, observer} from 'mobx-react'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useNavigate, useLocation} from 'react-router-dom'
import {Item} from './Item'
import qs from 'qs'
import {Button} from '../../components'

export const List = inject(
  'AuthStore',
  'ProjectStore'
)(
  observer(props => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    // const {page=1} = useParams()
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
            {/*<small className="text-muted">Total result: {0}</small>*/}
          </div>
          <div className="row g-2">
            {filteredList.map(i => (
              <Item key={i.id} id={i.id} data={i} />
            ))}
          </div>
          <Button className="btn btn-primary" onClick={handleGetMore}>
            Get More
          </Button>
          {/*{this.props.count &&*/}
          {/*<Pagination page={this.state.page} count={this.props.count}*/}
          {/*            limit={this.state.limit} range={this.state.range}*/}
          {/*            query={{search: this.props.search}}/>}*/}
        </div>
      </React.Fragment>
    )
  })
)

// @inject('AuthStore', 'UserStore')
// @observer
// class List extends Component {
//
//   constructor(props) {
//     super(props);
//     const params = new URLSearchParams(props.location.search);
//     const search = params.get('search') || '';
//     const page = params.get('page') || 1;
//     this.state = {
//       me: props.me,
//       count: 0,
//       page,
//       limit: 10,
//       range: 10,
//       items: [],
//       query: search,
//       search: search,
//       filteredItems: false,
//       system: false
//     }
//   }
//
//   handleFilter = (e) => {
//     e.preventDefault();
//     const query = e.currentTarget.value.toLowerCase();
//     this.setState({query});
//   };
//
//   // handleSearch = (e) => {
//   //   e.preventDefault();
//   //   console.log(e.key);
//   //   if (e.key === 'Enter')
//   //     return this.props.history.push('?search=' + this.state.query);
//   // };
//
//   renderItems = () => {
//     const {isAdmin, isEditor} = this.props.AuthStore.me;
//     const {list} = this.props.UserStore;
//     const filteredList = [...list.values()].filter(i => (i.first.toLowerCase().indexOf(this.state.query) > -1 || i.last.toLowerCase().indexOf(this.state.query) > -1
//         || i.username.toLowerCase().indexOf(this.state.query) > -1));
//     //if (!(status === 'ready')) return false;
//     if (!list) return false;
//     //const items = this.props.filteredItems || this.props.system.data.users;
//     return filteredList.map(item => {
//       return <div className="col-sm-4" key={item.uid}>
//         <div className="card mb-2">
//           <div className="card-body p-2">
//             <Avatar className="img-thumbnail rounded-circle float-left me-2"
//                     src={item.avatar} alt={item.name}
//                     width="100" height="100"/>
//             <div className="">
//               <h3 className="h5 card-title text-truncate">
//                 <i className={item.icon}/>&nbsp;&nbsp;{item.name}</h3>
//               <p className="text-truncate">
//                 <small>{item.username}</small>
//               </p>
//               <div className="text-right">
//                 {item.uid &&
//                 <Link to={'/' + (item.username || item.uid)} className="btn btn-sm btn-primary">PROFILE</Link>}
//                 {(isAdmin || isEditor) &&
//                 <Link to={'/users/' + item.uid + '/edit'} className="btn btn-sm btn-success ms-1">EDIT</Link>}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>;
//     })
//   };
//
//   render() {
//
//     //const {data} = this.props.UserStore;
//
//     // if (!this.props.system) {
//     //   return <div>Loading...</div>;
//     // }
//     // if (this.props.system.error) {
//     //   return <div>{this.props.system.error}</div>;
//     // }
//     return (<React.Fragment>
//         <div className="list">
//           <div className="searchInput text-right pr-4">
//             {/*<Input type="text" className="form-control-sm" placeholder="Filter ..." value={this.state.query}*/}
//             {/*       onChange={this.handleFilter}/>*/}
//             {/*<small className="text-muted">Total result: {this.props.count}</small>*/}
//           </div>
//           <div className="row">
//             {this.renderItems()}
//           </div>
//           {/*{this.props.count &&*/}
//           {/*<Pagination page={this.state.page} count={this.props.count}*/}
//           {/*            limit={this.state.limit} range={this.state.range}*/}
//           {/*            query={{search: this.props.search}}/>}*/}
//         </div>
//       </React.Fragment>
//     );
//   }
// }
//
// export default List;
