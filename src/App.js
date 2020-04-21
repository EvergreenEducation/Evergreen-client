import React, { Component } from 'react';
import {reactLocalStorage} from 'reactjs-localstorage';
import AuthService from 'services/AuthService';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { Button } from 'antd';
import HomePage from 'screens/HomePage';
const AuthScreen = imported(() => import('screens/AuthScreen'));
const AdminDashboardScreen = imported(() => import('screens/AdminDashboardScreen'));
const ProviderDashboardScreen = imported(() => import('screens/ProviderDashboardScreen'));
const Result = imported(() => import('antd/lib/result'));

class App extends Component {
  componentDidMount() {
    const currentSession = reactLocalStorage.getObject('currentSession');
    if (currentSession) {
      AuthService.setCurrentSession(currentSession);
    } else {
      window.location.replace(`/`)
    }
  }
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
            path="/auth/:action"
            component={props => {
              return <AuthScreen />;
            }}
          />
          <Route
            path="/admin"
            component={AdminDashboardScreen}
          />
          <Route
            path="/provider/:id"
            component={ProviderDashboardScreen}
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
                  <>
                    <Button
                      className="rounded"
                      size="small"
                      type="primary"
                    >
                      <Link to="/">
                        Return to the homepage
                      </Link>
                    </Button>
                    <Button
                      className="rounded mr-2"
                      size="small"
                      type="primary"
                      onClick={() => {
                        window.location.replace(`${process.env.REACT_APP_API_URL}/login`)
                      }}
                    >
                        Return to login
                    </Button>
                  </>
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
