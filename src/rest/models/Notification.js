import {action, makeObservable, observable} from 'mobx'

export class Notification {
  constructor(data) {
    this.status = data.status
    this.code = data.code
    this.message = data.message
    this.isDisplayed = false
    this.createdAt = data.createdAt
    this.timeless = data.timeless || false
    this.timeOut = null

    makeObservable(this, {
      isDisplayed: observable,
      hide: action,
    })
  }

  hide = () => (this.isDisplayed = true)

  hideTimeout = (timeout = 3000) => {
    if (!this.timeless && !this.timeOut)
      this.timeOut = setTimeout(() => this.hide(), timeout)
  }
}
