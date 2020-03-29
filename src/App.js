import "./firebase/initialize";
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Routes from './routes.js';
import {ScrollToTop} from "./components";
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';

import Home from "./pages/Dashboard/translations-en.json";

i18next.init({
  interpolation: {escapeValue: false},  // React already does escaping
  lng: 'en',                              // language to use
  resources: {
    en: {
      Home: Home               // 'common' is our custom namespace
    }
  },
});

const App = () =>
  <I18nextProvider i18n={i18next}>
    <Router>
      <ScrollToTop/>
      <Switch>
        <Route path="/" component={Routes}/>
      </Switch>
    </Router>
  </I18nextProvider>;

export default App;
