const path = require('path')

const {
  override,
  addDecoratorsLegacy,
  addWebpackAlias,
  overrideDevServer,
  watchAll,
} = require('customize-cra')

module.exports = {
  webpack: override(
    addDecoratorsLegacy(),
    addWebpackAlias({
      src: path.resolve(__dirname, './src'),
      components: path.resolve(__dirname, './src/components'),
      materials: path.resolve(__dirname, './src/components/materials'),
      form: path.resolve(__dirname, './src/components/form'),
      pages: path.resolve(__dirname, './src/pages'),
      fb: path.resolve(__dirname, './src/rest/firebase'),
      models: path.resolve(__dirname, './src/rest/models'),
      stores: path.resolve(__dirname, './src/rest/stores'),
      services: path.resolve(__dirname, './src/rest/services'),
      helpers: path.resolve(__dirname, './src/rest/helpers'),
      images: path.resolve(__dirname, './src/assets/images'),
      assets: path.resolve(__dirname, './src/assets'),
      layouts: path.resolve(__dirname, './src/layouts'),
      routing: path.resolve(__dirname, './src/routing'),
    })
  ),
  devServer: overrideDevServer(watchAll()),
}
