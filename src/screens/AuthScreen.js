import React from 'react';
import AuthService from 'services/AuthService';
import {
  Redirect,
  useLocation,
} from 'react-router-dom';

import axiosInstance from 'services/AxiosInstance';
import useAxios, { configure } from 'axios-hooks'

configure({
  axios: axiosInstance
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


function Auth() {
    let query = useQuery();
    let user_id = query.get('user_id');
    
    const [{ data:myProfile, loading, error } ] = useAxios(`/users/${user_id}`);

    if (loading) {
      // Kev help me put a loader screen here
      return <div>Test</div>;
    } else if (error) {
      return <Redirect to={{ pathname: '/error/500'}}/>
    }

    AuthService.setAuthenticated();
    AuthService.setCurrentSession({
      ...myProfile
    });
    
    if (!myProfile.role) {
      return <Redirect to={{ pathname: '/auth/role_selection'}}/>
    }

    return <Redirect to={{ pathname: '/admin'}}/>
}

export default Auth;
