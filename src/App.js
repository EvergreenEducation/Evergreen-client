import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import HomePage from 'pages/HomePage';
import LoginRegisterPage from 'pages/LoginRegisterPage';
import AdminDashboardPage from 'pages/AdminDashboardPage';
import './App.css';

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
