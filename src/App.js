import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { Shortener, Redirector } from './pages';
import 'bulma/css/bulma.min.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/:hash">
          <Redirector />
        </Route>
        <Route path="/">
          <Shortener />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
