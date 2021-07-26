import {SystemMessageStore} from './SystemMessageStore'
// import NotificationStore from './NotificationStore';
import {AuthStore} from './AuthStore'
import {UserStore} from './UserStore'

class RootStore {
  constructor() {
    this.SystemMessageStore = new SystemMessageStore(this)
    // this.NotificationStore = new NotificationStore(this);
    this.AuthStore = new AuthStore(this)
    this.UserStore = new UserStore(this)
  }
}

export const stores = new RootStore()
