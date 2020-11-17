import * as Yup from 'yup'
import i18next from './i18'

export class Validator {
  i = 0

  constructor() {
    console.log({language: i18next.language}, this.i++)
  }

  get test() {
    return i18next.t('test test test')
  }

  get email() {
    return Yup.string()
      .required(i18next.t('Email is required'))
      .email(i18next.t('Email must be a valid email'))
  }

  get password() {
    return Yup.string()
      .required(i18next.t('Password is required'))
      .matches(
        /[A-Z]+/,
        i18next.t('Password must include at least one uppercase character')
      )
      .matches(
        /[a-z]+/,
        i18next.t('Password must include at least one lowercase character')
      )
      .matches(/[0-9]+/, i18next.t('Password must contain a number'))
      .matches(
        /[!@#$%\\^&*)(+=._-]+/,
        i18next.t('Password must include at least one special character')
      )
      .min(8, i18next.t('Password is too short - should be 8 chars minimum'))
  }

  get remember() {
    return Yup.boolean()
  }
}
