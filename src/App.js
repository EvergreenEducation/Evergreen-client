import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import loadable from '@loadable/component';
import HomePage from 'pages/HomePage';
const LoginRegisterPage = loadable(() => import('pages/LoginRegisterPage'));
const AdminDashboardPage = loadable(() => import('pages/AdminDashboardPage'));

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            component={HomePage}
          />
          <Route
            path="/auth"
            component={LoginRegisterPage}
          />
          <Route
            path="/admin"
            component={AdminDashboardPage}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;