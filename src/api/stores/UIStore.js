import {action, observable} from 'mobx';

export default class {
  @observable height = Math.max(document.body.scrollHeight, window.innerHeight);
  @observable width = Math.max(document.body.scrollWidth, window.innerWidth);
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
