import React from 'react';
import AuthService from 'services/AuthService';
import {
  Redirect,
  useLocation
} from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Auth() {
    let query = useQuery();
    let user_id = query.get('user_id');

    if (user_id) {
      AuthService.setAuthenticated();
      AuthService.setCurrentSession({
        user_id
      });

      return <Redirect to={{ pathname: '/admin'}}/>
    } else {
      return <Redirect to={{ pathname: '/'}}/>
    }
}

export default Auth;
