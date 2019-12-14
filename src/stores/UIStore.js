import {action, computed, observable} from 'mobx';

export default class {
  @observable height = window.innerHeight;
  @observable width = window.innerWidth;
  @action setHeight = height => (this.height = height);
  @action setWidth = width => (this.width = width);

  constructor(Stores) {
    this.stores = Stores;
    //console.log('store: UIStore');
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
  //@observable width = window.innerWidth;
  @observable initURL = '/';
  @observable navCollapsed = false;
  @observable intlProviderRef = null;

  @action
  setIntlProviderRef = r => {
    this.intlProviderRef = r;
  };

  showAuthLoader() {
    this.loader = true;
  }

  hideAuthLoader() {
    this.loader = false;
  }

  hideMessage() {
    this.showMessage = false;
  }

  @action
  updateWindowWidth(width) {
    this.width = width;
  }

  @action
  toggleCollapsedSideNav() {
    this.navCollapsed = !this.navCollapsed;
  }

  @action
  onNavStyleChange = navStyle => {
    this.navStyle = navStyle;
  };

  @computed
  get fullMap() {
    return this.width < 800;
  }
}
