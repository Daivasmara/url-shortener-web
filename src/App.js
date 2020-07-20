import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { Shortener, Redirector } from './pages';

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
