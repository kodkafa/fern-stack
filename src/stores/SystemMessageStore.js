import {action, computed, observable, toJS} from 'mobx';
import {SystemMessageModel} from '../models/SystemMessageModel';

export default class {
  @observable _list = new observable.array();

  constructor(Stores) {
    this.stores = Stores;
    //this.service = new UserService();
    this.model = SystemMessageModel;
    //console.log('store: UserStore');
    //this.deepEqual = require('deep-equal');
  }

  get list() {
    // get from local stores
    return toJS(this._list)
  }

  get news() {
    // get from local stores
    return this.list.filter(i => i.isDisplayed === false)
  }

  @computed
  set list(item) {
    return this._list.set(item);
  }

  @action
  remove(id) {
    this._list.delete(id);
  }

  @action
  add(doc) {
    const item = new this.model(doc);//this.model.fromJS(doc); // ?
    const legacy = this._list.filter(i => i.createdAt === doc.createdAt);
    console.log('system messages add', legacy.length, legacy);
    if (legacy.length) {
      if (JSON.stringify(item) !== JSON.stringify(legacy[0])
      //if (item.toJS !== legacy[0].toJS
      //if (item.toJS !== legacy[0].toJS
      // !this.deepEqual(
      //   item.toJS(),//this.model.toComparableJS(), ??
      //   this._list.get(doc.id).toJS()
      // )
      )
        this._list.push(item);
    } else
      this._list.push(item);

    console.log('system messages _list', this.list);
  }

  handleError({code, message}) {
    this.add({status: 400, code, message, createdAt: new Date()})
  }

  // toJS() {
  //   return this.todos.map(item => item.toJS());
  // }

  // static fromJS(array) {
  //   const errorStore = new ErrorStore();
  //   errorStore.list = array.map(item => this.model.fromJS(errorStore, item));
  //   return errorStore;
  // }

  // @action setUserLocation = () => {
  //   navigator.geolocation.getCurrentPosition(position => {
  //     runInAction(() => {
  //       this.userLocation.lat = position.coords.latitude;
  //       this.userLocation.lng = position.coords.longitude;
  //     });
  //   });
  // };
}
