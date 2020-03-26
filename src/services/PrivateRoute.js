import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from 'services/AuthService';

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => {
                if (AuthService.isAuthenticated === true) {
                    return <Component {...props} />;
                }
                return (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: {
                                from: props.location,
                            }
                        }}
                    />
                );
            }}
        />
    );
}

export default PrivateRoute;
