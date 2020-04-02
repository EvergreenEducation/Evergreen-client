import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import HomePage from 'screens/HomePage';
import { Button } from 'antd';
const LoginRegisterPage = imported(() => import('screens/LoginRegisterPage'));
const AdminDashboardScreen = imported(() => import('screens/AdminDashboardScreen'));
const Result = imported(() => import('antd/lib/result'));

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
          <Route
            path="/provider/:id"
            children={() => (<div>test</div>)}
          />
          <Route
            exact
            path="/error/500"
            component={() => (
              <Result
                status="500"
                title="500"
                subTitle="Something went wrong with our server, come back later."
                extra={
                  <Button
                    className="rounded"
                    size="small"
                    type="primary"
                  >
                    <Link to="/auth">
                      Return to login
                    </Link>
                  </Button>
                }
              />
            )}
          />
          <Route
            component={() => (
              <Result
                status="404"
                title="404"
                subTitle="The page you're visiting does not exist."
                extra={
                  <Button
                    className="rounded"
                    size="small"
                    type="primary"
                  >
                    <Link to="/">
                      Return to the homepage
                    </Link>
                  </Button>
                }
              />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
