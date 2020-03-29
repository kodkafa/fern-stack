import {action, observable} from 'mobx';

export default class {
  @observable height = window.innerHeight;
  @observable width = window.innerWidth;
  @action setHeight = height => (this.height = height);
  @action setWidth = width => (this.width = width);

  constructor(Stores) {
    this.stores = Stores;
  }

  @observable loader = false;
  @observable alertMessage = '';
  @observable showMessage = false;
  @observable locale = {
    languageId: 'english',
    code: 'en',
    name: 'English',
    icon: 'us',
  };

  // @observable initURL = '/';
  // @observable navCollapsed = false;
  // @observable intlProviderRef = null;
  //
  // @action
  // setIntlProviderRef = r => {
  //   this.intlProviderRef = r;
  // };
}
