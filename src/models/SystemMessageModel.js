import {observable, toJS} from 'mobx';

export class SystemMessageModel {

  @observable isDisplayed = false;

  constructor(data) {
    console.log('system message model constructor', data);
    this.status = data.status;
    this.code = data.code;
    this.message = data.message;
    this.isDisplayed = false;
    this.createdAt = data.createdAt;
  }

  hide = () => this.isDisplayed = true;

  hideTimeout = (timeout = 10000) => {
    setTimeout(() => this.hide(), timeout)
  };

  get toJS() {
    return toJS(this);
  }

  //
  // toJS() {
  //   return {status, code, message this.isDisplayed, cre
  //     status: this.uid,
  //     phoneNumber: this.phoneNumber,
  //     email: this.email
  //   };
  // }

  static fromJS(store, object) {
    return new SystemMessageModel(store, object);
  }
}
