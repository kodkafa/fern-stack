import {firebase, APIURL} from 'fb/initialize'

export class Services {
  static getToken = async () => {
    try {
      return await firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(idToken => {
          return idToken
        })
        .catch(e => {
          return false
        })
    } catch (e) {
      console.log({e})
    }
  }

  static get = async params => {
    const id = typeof params === 'string' ? params : null
    const token = await this.getToken()
    //const data = {idToken: token, id};
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
      //body: JSON.stringify(data)
    }
    const url = APIURL + (id ? '/users/' + id : '/users/?' + params)
    const response = await fetch(url, options)
    const result = await response.json()
    if (response.status === 200) {
      return result
    } else {
      //error
      console.log('error get response', result)
      return result
    }
    //return response.json();
  }
  static post = async model => {
    const token = await this.getToken()
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
      body: JSON.stringify(model),
    }
    const request = new Request(APIURL, options)
    return await fetch(request)
  }
  static put = async (id, model) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const options = {
      method: 'PUT',
      headers,
      body: JSON.stringify(model),
    }
    const request = new Request(APIURL + '/' + id, options)
    return await fetch(request)
  }
  static delete = async id => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const options = {
      method: 'DELETE',
      headers,
    }
    const request = new Request(APIURL + '/' + id, options)
    return await fetch(request)
  }

  static toggleClaim = async (id, model) => {
    const token = await this.getToken()
    const options = {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(model),
    }
    const request = new Request(
      APIURL + '/users/' + id + '/toggleClaim',
      options
    )
    return await fetch(request)
  }

  static toggleAdmin = async (id, model) => {
    const token = await this.getToken()
    console.log('toggleAdmin', {model})

    const options = {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(model),
    }
    const request = new Request(
      APIURL + '/users/' + id + '/toggleAdmin',
      options
    )
    return await fetch(request)
  }
}
