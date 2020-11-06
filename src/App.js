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
import { GlobalProvider } from 'store/GlobalStore';
import { Helmet } from 'react-helmet';
import EvergreenLogo from 'assets/svgs/evergreen-optimized-logo.svg';
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
  let isUrlCustomPage = window.location.href.indexOf("evg") > -1 ? true : false,
    pageUrl = isUrlCustomPage ? window.location.pathname.replace('/evg/', '') : '';
  return (
    <GlobalProvider>
      <Helmet>
        <title>Evergreen</title>
        <link
          rel="icon"
          href={EvergreenLogo}
          sizes="any"
          type="image/svg+xml"
        ></link>
      </Helmet>
      <Router>
        <Switch>
          <Redirect exact from="/" to="home" />
          <Route path="/home" component={HomeScreen} />
          <Route path="/auth/:action" component={AuthScreen} />
          {/* <Route path="/custom/:id" component={CustomHomePage} /> */}
          <Route path={`/evg/:${pageUrl}`} component={HomeScreen} />
          {/* <Route path="/custom/:id/:id" component={HomeScreen} /> */}
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
    </GlobalProvider>
  );
}

export default App;
