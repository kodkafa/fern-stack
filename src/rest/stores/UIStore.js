import {makeObservable, observable} from 'mobx'

export class UIStore {
  // @observable height = Math.max(document.body.scrollHeight, window.innerHeight)
  // @observable width = Math.max(document.body.scrollWidth, window.innerWidth)
  // @action setHeight = height => (this.height = height)
  // @action setWidth = width => (this.width = width)

  constructor(Stores) {
    this.stores = Stores
    this.loader = false
    this.locale = {
      languageId: 'english',
      code: 'en',
      name: 'English',
      icon: 'us',
    }
    makeObservable(this, {
      loader: observable,
      locale: observable.deep,
    })
  }

  // @observable initURL = '/';
  // @observable navCollapsed = false;
  // @observable intlProviderRef = null;
  //
  // @action
  // setIntlProviderRef = r => {
  //   this.intlProviderRef = r;
  // };
}
