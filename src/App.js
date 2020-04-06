import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useParams,
  Redirect
} from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { Button } from 'antd';
import HomePage from 'screens/HomePage';
import RoleSelectionScreen from 'screens/RoleSelectionScreen';
const AuthScreen = imported(() => import('screens/AuthScreen'));
const EmailNotVerifiedScreen = imported(() => import('screens/EmailNotVerifiedScreen'));
const AdminDashboardScreen = imported(() => import('screens/AdminDashboardScreen'));
const Result = imported(() => import('antd/lib/result'));

function AuthAction() {
  const params = useParams();
  const { action } = params;
  if (action === 'email_not_verified') {
    return <EmailNotVerifiedScreen />
  } else if (action === 'logout') {
    window.location.replace(`${process.env.REACT_APP_API_URL}/logout`)
  } else if (action === 'role_selection') {
    return <RoleSelectionScreen />
  }
  else {
    return <Redirect to={{ pathname: '/'}}/>
  }
}

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
            path="/auth/:action"
            component={props => {
              return <AuthAction />;
            }}
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
