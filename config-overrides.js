const path = require('path');
const {override, addDecoratorsLegacy} = require('customize-cra');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

const overrideProcessEnv = value => (config, env) => {
  config = rewireReactHotLoader(config, env);
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-dom': '@hot-loader/react-dom'
  };
  config.resolve.modules = [
    path.join(__dirname, 'src')
  ].concat(config.resolve.modules);
  return config;
};

module.exports = override(
  addDecoratorsLegacy(),
  overrideProcessEnv({
    VERSION: JSON.stringify(require('./package.json').version),
  })
);
