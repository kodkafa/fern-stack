import "./firebase/initialize";
import React from 'react';
import {Provider} from 'mobx-react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Routes from './routes';
import {stores} from './stores';
import {ScrollToTop} from "components";

const App = () =>
  <Provider {...stores}>
    <Router>
      <ScrollToTop/>
      <Switch>
        <Route path="/" component={Routes}/>
      </Switch>
    </Router>
  </Provider>;

export default App;
