import i18next from 'i18next'
import EN from '../../translations/en.json'
import TR from '../../translations/tr.json'

i18next.init({
  interpolation: {escapeValue: false}, // React already does escaping
  lng: 'en-US', // language to use
  // parseMissingKeyHandler: (key) => {console.log('MISSING KEY',{key})},
  keySeparator: false, // we do not use keys in form messages.welcome
  react: {
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'span'], // don't convert to <1></1> if simple react elements
  },
  resources: {
    'en-US': {
      translation: EN,
    },
    'tr-TR': {
      translation: TR,
    },
  },
})

export default i18next
