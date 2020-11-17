module.exports = {
 contextSeparator: '',
 // Key separator used in your translation keys

 createOldCatalogs: false,
 // Save the \_old files

 defaultNamespace: 'translation',
 // Default namespace used in your i18next config

 defaultValue: "",
 // Default value to give to empty keys

 indentation: 1,
 // Indentation of the catalog files
 
 keepRemoved: false,
 // Keep keys from the catalog that are no longer in code

 keySeparator: 'false',
 // Key separator used in your translation keys
 // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.

 // see below for more details
 lexers: {
   hbs: ['HandlebarsLexer'],
   handlebars: ['HandlebarsLexer'],

   htm: ['HTMLLexer'],
   html: ['HTMLLexer'],

   mjs: ['JavascriptLexer'],
   js: ['JavascriptLexer'], // if you're writing jsx inside .js files, change this to JsxLexer
   ts: ['JavascriptLexer'],
   jsx: ['JsxLexer'],
   tsx: ['JsxLexer'],

   default: ['JavascriptLexer']
 },

 lineEnding: 'auto',
 // Control the line ending. See options at https://github.com/ryanve/eol

 locales: ['en', 'fr', 'tr'],
 // An array of the locales in your applications

 namespaceSeparator: 'false',
 // Namespace separator used in your translation keys
 // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.

 output: './src/translations/$LOCALE.json',
 // Supports $LOCALE and $NAMESPACE injection
 // Supports JSON (.json) and YAML (.yml) file formats
 // Where to write the locale files relative to process.cwd()

 input: './src/**/*.{js,hbs}',
 // An array of globs that describe where to look for source files
 // relative to the location of the configuration file

 reactNamespace: true,
 // For react file, extract the defaultNamespace - https://react.i18next.com/latest/withtranslation-hoc
 // Ignored when parsing a `.jsx` file and namespace is extracted from that file.

 sort: false,
 // Whether or not to sort the catalog

 skipDefaultValues: false,
 // Whether to ignore default values.

 useKeysAsDefaultValue: true,
 // Whether to use the keys as the default value; ex. "Hello": "Hello", "World": "World"
 // This option takes precedence over the `defaultValue` and `skipDefaultValues` options

 verbose: false,
 // Display info about the parsing including some stats

 customValueTemplate: false
 
//  "$LOCALE" === 'en' ? "${defaultValue}" : ''
 // If you wish to customize the value output the value as an object, you can set your own format.
 // ${defaultValue} is the default value you set in your translation function.
 // Any other custom property will be automatically extracted.
 //
 // Example:
 // {
 //   message: "${defaultValue}",
 //   description: "${maxLength}", // t('my-key', {maxLength: 150})
 // }
}