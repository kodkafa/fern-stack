import {autorun} from 'mobx'
import {inject, observer} from 'mobx-react'
import React from 'react'
import {useTranslation} from 'react-i18next'

export const SignOut = inject('AuthStore')(
  observer(props => {
    const {t} = useTranslation()
    autorun(() => {
      props.AuthStore.signOut()
    })
    return (
      <section className="container">{t('Sorry to see you go ...')}</section>
    )
  })
)
