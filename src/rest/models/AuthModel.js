export class AuthModel {
  constructor(data) {
    this.uid = data.uid
    this.phoneNumber = data.phoneNumber
    this.email = data.email
    this.emailVerified = data.emailVerified
    this.metadata = data.metadata
    this.lastLogin = this.metadata && this.metadata.lastSignInTime
    this.createdAt = this.metadata && this.metadata.creationTime
    this.providerData = data.providerData
    this.customClaims = data.customClaims || {}
    this.icon = this.isAdmin()
      ? 'fas fa-user-astronaut'
      : this.isEditor()
      ? 'fa fa-user-secret'
      : this.isManager() || this.isWorker()
      ? 'fa fa-user-tie'
      : 'fa fa-user'
    this.disabled = data.disabled
  }

  isAdmin = () => {
    return 'admin' in this.customClaims ? this.customClaims.accessLevel : false
  }

  isEditor = () => {
    return 'editor' in this.customClaims ? this.customClaims.accessLevel : false
  }

  isManager = () => {
    return 'manager' in this.customClaims
      ? this.customClaims.accessLevel
      : false
  }

  isWorker = () => {
    return 'worker' in this.customClaims ? this.customClaims.accessLevel : false
  }
}
