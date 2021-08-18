import {_Base} from './_Base'

export class Project extends _Base {
  constructor(data = {}) {
    super(data)
    this.name = data.name
    this.description = data.description
    this.domains = data.domains || []
  }
}
