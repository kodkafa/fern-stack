import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Input} from "reactstrap";
import {Avatar} from '../../components';

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

  handleFilter = (e) => {
    e.preventDefault();
    const query = e.currentTarget.value.toLowerCase();
    this.setState({query});
  };

  // handleSearch = (e) => {
  //   e.preventDefault();
  //   console.log(e.key);
  //   if (e.key === 'Enter')
  //     return this.props.history.push('?search=' + this.state.query);
  // };

  renderItems = () => {
    const {isAdmin, isEditor} = this.props.AuthStore.me;
    const {list} = this.props.UserStore;
    const filteredList = [...list.values()].filter(i => (i.first.toLowerCase().indexOf(this.state.query) > -1 || i.last.toLowerCase().indexOf(this.state.query) > -1
        || i.username.toLowerCase().indexOf(this.state.query) > -1));
    //if (!(status === 'ready')) return false;
    if (!list) return false;
    //const items = this.props.filteredItems || this.props.system.data.users;
    return filteredList.map(item => {
      return <div className="col-sm-4" key={item.uid}>
        <div className="card mb-2">
          <div className="card-body p-2">
            <Avatar className="img-thumbnail rounded-circle float-left mr-2"
                    src={item.avatar} alt={item.name}
                    width="100" height="100"/>
            <div className="">
              <h3 className="h5 card-title text-truncate">
                <i className={item.icon}/>&nbsp;&nbsp;{item.name}</h3>
              <p className="text-truncate">
                <small>{item.username}</small>
              </p>
              <div className="text-right">
                {item.uid &&
                <Link to={'/' + (item.username || item.uid)} className="btn btn-sm btn-primary">PROFILE</Link>}
                {(isAdmin || isEditor) &&
                <Link to={'/users/' + item.uid + '/edit'} className="btn btn-sm btn-success ml-1">EDIT</Link>}
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
            <Input type="text" className="form-control-sm" placeholder="Filter ..." value={this.state.query}
                   onChange={this.handleFilter}/>
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

export default List;
