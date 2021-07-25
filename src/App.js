import './rest/firebase/initialize'
import React, {useEffect} from 'react'
import {Routing} from './Routing.js'
import {I18nextProvider} from 'react-i18next'
import i18next from './rest/helpers/i18'
import {Loader} from './components'
import {inject, observer} from 'mobx-react'

export const App = inject('AuthStore')(
  observer(props => {
    const {authenticated, handleAuth} = props.AuthStore
    useEffect(() => {
      if (authenticated === false) {
        handleAuth()
      }
    }, [handleAuth, authenticated])

    return (
      <I18nextProvider i18n={i18next}>
        {authenticated === null ? (
          <Loader backgroud={true} />
        ) : (
          <Routing authenticated={authenticated} />
        )}
      </I18nextProvider>
    )
  })
)
