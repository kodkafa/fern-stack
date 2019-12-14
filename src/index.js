import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from './serviceWorker';
import App from "./App";

const render = Component => {
  ReactDOM.render(
    <Component/>,
    document.getElementById('root')
  );
};

serviceWorker.register();
render(App);

if (module.hot) {
  console.debug('hot module');
  module.hot.accept('./App', () => {
    render(App);
  });
}



