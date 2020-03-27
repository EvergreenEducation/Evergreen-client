import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import importedComponent from 'react-imported-component';
import HomePage from 'screens/HomePage';
const LoginRegisterPage = importedComponent(() => import('screens/LoginRegisterPage'));
const AdminDashboardPage = importedComponent(() => import('screens/AdminDashboardPage'));

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