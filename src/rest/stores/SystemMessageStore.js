import {action, computed, makeObservable, observable} from 'mobx'
import {SystemMessage as Model} from 'models'
import React from 'react'

export class SystemMessageStore {
  newRelease = false
  list = []

  constructor(Stores) {
    this.stores = Stores

    makeObservable(this, {
      newRelease: observable,
      list: observable.deep,
      news: computed,
      add: action,
      setNewRelease: action,
    })
  }

  get news() {
    return this.list.filter(i => i.isDisplayed === false)
  }

  @action
  add(doc) {
    const item = new Model(doc)
    const legacy = this.list.filter(i => i.createdAt === doc.createdAt)
    if (legacy.length) {
      if (JSON.stringify(item) !== JSON.stringify(legacy[0]))
        this.list.push(item)
    } else this.list.push(item)
  }

  handleError({code = null, message}) {
    this.add({
      status: 400,
      code: code || 'ERROR',
      message: this.linkify(message),
      createdAt: new Date(),
    })
    return false
  }

  handleSuccess({code = null, message}) {
    this.add({
      status: 200,
      code: code || 'SUCCESS',
      message: this.linkify(message),
      createdAt: new Date(),
      timeout: 1000,
    })
    return true
  }

  @action
  setNewRelease(v, message) {
    this.newRelease = v
    this.add({
      status: 100,
      code: 'NEW_VERSION',
      message,
      createdAt: new Date(),
      timeless: true,
    })
  }

  shortener = (text, max = 30) => {
    return text.length > max ? text.substr(0, 20) + '...' : text
  }

  linkify = text => {
    //URLs starting with http://, https://, or ftp://
    const patternURL = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim
    //text = text.replace(patternURL, (link) => '<a href="' + link + '" target="_blank">' + this.shortener(link) + '</a>');
    text = text.replace(patternURL, link => (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {this.shortener(link)}
      </a>
    ))

    //URLs starting with www. (without // before it, or it'd re-link the ones done above)
    const patternWWW = /(^|[^/])(www\.[\S]+(\b|$))/gim
    //text = text.replace(patternWWW, '$1<a href="http://$2" target="_blank">$2</a>');
    text = text.replace(
      patternWWW,
      <React.Fragment>
        {'$1'}
        <a href={'http://$2'} target="_blank" rel="noopener noreferrer">
          {'$2'}
        </a>
      </React.Fragment>
    )

    //Change email addresses to mailto:: links
    const patternMAIL = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim
    text = text.replace(
      patternMAIL,
      <a href={'mailto:$1'} rel="noopener noreferrer">
        {'$1'}
      </a>
    )

    return text
  }
}
