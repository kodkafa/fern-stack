import {action, makeObservable} from 'mobx'
import {Project as Model} from 'rest/models'
import {_Base} from 'rest/stores/_Base'

const COLLECTION = 'projects'
export class ProjectStore extends _Base {
  constructor(Stores) {
    super(Stores, Model, COLLECTION)
    makeObservable(this, {
      getItemBySlug: action,
    })
  }

  info = () => {
    this.base()
    console.log('info', this)
  }
}
