import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from 'services/AuthService';

function PrivateRoute({ component: Component, restrictToRole, role, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (restrictToRole && restrictToRole.length) {
          if (role !== restrictToRole) {
            return (
              <Redirect
                to={{
                  pathname: '/error/401',
                  state: {
                    from: props.location,
                  },
                }}
              />
            );
          }
        }
        if (AuthService.authenticated) {
          return <Component {...props} />;
        }
        return (
          <Redirect
            to={{
              pathname: '/error/401',
              state: {
                from: props.location,
              },
            }}
          />
        );
      }}
    />
  );
}

export default PrivateRoute;
