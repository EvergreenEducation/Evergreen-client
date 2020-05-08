import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import AuthService from 'services/AuthService';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { Button } from 'antd';
import HomeScreen from 'screens/HomeScreen/HomeScreen';
import PrivateRoute from 'services/PrivateRoute';

const AuthScreen = imported(() => import('screens/AuthScreen'));
const Result = imported(() => import('antd/lib/result'));
const DashboardScreen = imported(() => import('screens/DashboardScreen'));

function App() {
  const currentSession = reactLocalStorage.getObject('currentSession');

  if (currentSession) {
    AuthService.setCurrentSession(currentSession);
  } else {
    return window.location.replace(`/`);
  }

  return (
    <Router>
      <Switch>
        <Redirect exact from="/" to="home" />
        <Route path="/home" component={HomeScreen} />
        <Route path="/auth/:action" component={AuthScreen} />
        <PrivateRoute path="/dashboard" component={DashboardScreen} />
        <Route
          exact
          path="/error/500"
          component={() => (
            <Result
              status="500"
              title="500"
              subTitle={
                "Either our server's asleep or something went wrong with it. Check back again later."
              }
              extra={
                <>
                  <Button className="rounded" size="small" type="primary">
                    <Link to="/">Return to the homepage</Link>
                  </Button>
                  <Button
                    className="rounded mr-2"
                    size="small"
                    type="primary"
                    onClick={() => {
                      window.location.replace(
                        `${process.env.REACT_APP_API_URL}/login`
                      );
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
          exact
          path="/error/401"
          component={() => (
            <Result
              status="403"
              title="401"
              subTitle={
                'Sorry, you currently do not have authorization to access this page.'
              }
              extra={
                <>
                  <Button className="rounded" size="small" type="primary">
                    <Link to="/">Return to the homepage</Link>
                  </Button>
                  <Button
                    className="rounded mr-2"
                    size="small"
                    type="primary"
                    onClick={() => {
                      window.location.replace(
                        `${process.env.REACT_APP_API_URL}/login`
                      );
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
                <Button className="rounded" size="small" type="primary">
                  <Link to="/">Return to the homepage</Link>
                </Button>
              }
            />
          )}
        />
      </Switch>
    </Router>
  );
}

export default App;
