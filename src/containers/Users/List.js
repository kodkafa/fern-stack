import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Input} from "reactstrap";

@inject('AuthStore', 'UserStore')
@observer
class List extends Component {

  constructor(props) {
    super(props);
    const params = new URLSearchParams(props.location.search);
    const search = params.get('search') || '';
    const page = params.get('page') || 1;
    this.state = {
      me: props.me,
      count: 0,
      page,
      limit: 10,
      range: 10,
      items: [],
      query: search,
      search: search,
      filteredItems: false,
      system: false
    }
  }

  componentDidMount() {
    // console.log('componentDidMount', this.state);
    // const {getUsers} = this.props.UserStore;
    // if (this.state.query) {
    //   const filter = {skip: Math.max(0, this.state.page - 1) * this.state.limit, limit: this.state.limit};
    //   getUsers({query: this.state.query, filter});
    // } else {
    //   getUsers();
    // }
  }

  componentDidUpdate(props) {
    // const params = new URLSearchParams(props.location.search);
    // const search = params.get('search') || '';
    // const page = params.get('page') || 1;
    // console.log('componentDidUpdate', props);
    //
    // if (page !== this.state.page) {
    //   console.log('page', props);
    //   const filter = {skip: Math.max(0, page - 1) * this.state.limit, limit: this.state.limit};
    //   this.setState({page: page});
    //   this.props.fetchList({query: this.state.query, filter});
    // } else if (search !== this.state.search) {
    //   console.log('search', props);
    //   this.setState({search});
    //   this.props.fetchList({query: search});
    // }
    //
    // if (props.data && props.data.items) {
    //   this.setState({
    //     isLoading: false,
    //     count: props.data.count,
    //     items: props.data.items,
    //     filteredItems: false
    //   });
    // }
  }

  handleFilter = (e) => {
    e.preventDefault();
    console.log(e.currentTarget.value);
    const query = e.currentTarget.value.toLowerCase();
    const filteredItems = this.state.items.filter(item => {
      console.log({item});
      return (item.name.toLowerCase().indexOf(query) > -1 || item.surname.toLowerCase().indexOf(query) > -1
        || item.username.toLowerCase().indexOf(query) > -1 || item.email.toLowerCase().indexOf(query) > -1)
    });
    this.setState({query, filteredItems});
  };

  handleSearch = (e) => {
    e.preventDefault();
    console.log(e.key);
    if (e.key === 'Enter')
      return History.push('?search=' + this.state.query);
  };

  renderItems = () => {
    const {isAdmin, isEditor} = this.props.AuthStore.me;
    const {status, list} = this.props.UserStore;
    console.log('data', list, typeof list);
    //if (!(status === 'ready')) return false;
    if (!list) return false;
    //const items = this.props.filteredItems || this.props.system.data.users;
    return [...list.values()].map(item => {
      return <div className="col-sm-4" key={item.uid}>
        <div className="card mb-2">
          <div className="card-body p-2">
            {item.photoURL &&
            <img className="img-thumbnail rounded-circle float-left mr-2"
                 src={item.photoURL} alt={item.displayName}
                 width="100"
            />}
            <div className="">
              <h3 className="h5 card-title">
                <i className={item.icon}/>&nbsp;&nbsp;{item.displayName}{item.email}</h3>
              <p>
                <small>{item.first}</small>
              </p>
              <div className="text-right">
                {item.uid &&
                <Link to={'/users/' + item.uid} className="btn btn-sm btn-primary">PROFILE</Link>}
                {(isAdmin || isEditor) &&
                <Link to={'/users/edit/' + item.uid} className="btn btn-sm btn-success ml-1">EDIT</Link>}
              </div>
            </div>
          </div>
        </div>
      </div>;
    })
  };

  render() {

    //const {data} = this.props.UserStore;

    // if (!this.props.system) {
    //   return <div>Loading...</div>;
    // }
    // if (this.props.system.error) {
    //   return <div>{this.props.system.error}</div>;
    // }
    return (<React.Fragment>
        <div className="list">
          <div className="searchInput text-right pr-4">
            <Input type="text" className="form-control-sm" placeholder="Filter or Search..." value={this.state.query}
                   onKeyUp={this.handleSearch} onChange={this.handleFilter}/>
            {/*<small className="text-muted">Total result: {this.props.count}</small>*/}
          </div>
          <div className="row">
            {this.renderItems()}
          </div>
          {/*{this.props.count &&*/}
          {/*<Pagination page={this.state.page} count={this.props.count}*/}
          {/*            limit={this.state.limit} range={this.state.range}*/}
          {/*            query={{search: this.props.search}}/>}*/}
        </div>
      </React.Fragment>
    );
  }
}

//
// const mapStateToProps = (state) => {
//   return {system: state.system, me: state.auth.me}
// };

export default List//connect(mapStateToProps, {fetchList})(List);
