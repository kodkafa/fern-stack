const {override,
  addDecoratorsLegacy,
  overrideDevServer,
  watchAll
} = require('customize-cra');

module.exports = {
  webpack: override(
    addDecoratorsLegacy()
  ),
  devServer: overrideDevServer(
    watchAll()
  )
};
