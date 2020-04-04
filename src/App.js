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
const AuthScreen = imported(() => import('screens/AuthScreen'));
const EmailNotVerifiedScreen = imported(() => import('screens/EmailNotVerifiedScreen'));
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
            exact
            path="/auth"
            component={AuthScreen}
          />
          <Route
            exact
            path="/auth/email_not_verified"
            component={EmailNotVerifiedScreen}
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
                subTitle={"Either our server's asleep or something went wrong with it. Check back again later."}
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
