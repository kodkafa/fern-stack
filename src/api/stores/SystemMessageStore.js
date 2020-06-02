import {action, computed, observable, toJS} from 'mobx';
import {SystemMessageModel} from '../models/SystemMessageModel';
import React from 'react';

export default class {
  @observable newRelease = false;
  @observable _list = new observable.array();

  constructor(Stores) {
    this.stores = Stores;
    this.model = SystemMessageModel;
  }

  get list() {
    return toJS(this._list)
  }

  get news() {
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
    const item = new this.model(doc);
    const legacy = this._list.filter(i => i.createdAt === doc.createdAt);
    if (legacy.length) {
      if (JSON.stringify(item) !== JSON.stringify(legacy[0]))
        this._list.push(item);
    } else
      this._list.push(item);
  }

  handleError({code, message}) {
    this.add({status: 400, code: code || 'ERROR', message: this.linkify(message), createdAt: new Date()});
    return false
  }

  @action
  setNewRelease(v, message) {
    this.newRelease = v;
    this.add({
      status: 100,
      code: 'NEW_VERSION',
      message,
      createdAt: new Date(),
      timeless: true
    })
  }

  shortener = (text, max = 30) => {
    return text.length > max ? text.substr(0, 20) + "..." : text;
  };

  linkify = (text) => {
    //URLs starting with http://, https://, or ftp://
    const patternURL = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
    //text = text.replace(patternURL, (link) => '<a href="' + link + '" target="_blank">' + this.shortener(link) + '</a>');
    text = text.replace(patternURL, (link) => <a href={link} target="_blank"
                                                 rel="noopener noreferrer">{this.shortener(link)}</a>);

    //URLs starting with www. (without // before it, or it'd re-link the ones done above)
    const patternWWW = /(^|[^/])(www\.[\S]+(\b|$))/gim;
    //text = text.replace(patternWWW, '$1<a href="http://$2" target="_blank">$2</a>');
    text = text.replace(patternWWW, <React.Fragment>{'$1'}<a href={"http://$2"} target="_blank"
                                                             rel="noopener noreferrer">{'$2'}</a></React.Fragment>);

    //Change email addresses to mailto:: links
    const patternMAIL = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    text = text.replace(patternMAIL, <a href={"mailto:$1"} rel="noopener noreferrer">{'$1'}</a>);

    return text
  };
}
