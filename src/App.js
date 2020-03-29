import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import HomePage from 'screens/HomePage';
const LoginRegisterPage = imported(() => import('screens/LoginRegisterPage'));
const AdminDashboardScreen = imported(() => import('screens/AdminDashboardScreen'));

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
            component={AdminDashboardScreen}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
