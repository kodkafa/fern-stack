import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import {App} from './App'
import {Provider} from 'mobx-react'
import {stores} from './rest/stores'
import reportWebVitals from './reportWebVitals'

const render = Component => {
  ReactDOM.render(
    <Provider {...stores}>
      <Component />
    </Provider>,
    document.getElementById('root')
  )
}

serviceWorker.register({
  onUpdate: registration => {
    registration.unregister().then(() => {
      caches.keys().then(function (cacheNames) {
        Promise.all(
          cacheNames.map(function (cacheName) {
            return caches.delete(cacheName)
          })
        ).then(() => {
          console.log('new version is released!')
          const message = (
            <span>
              New version is released. Please
              <button
                className="btn-link"
                onClick={() => window.location.reload()}>
                refresh
              </button>{' '}
              the page
            </span>
          )
          stores.SystemMessageStore.setNewRelease(true, message)
        })
      })
    })
  },
})
render(App)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
