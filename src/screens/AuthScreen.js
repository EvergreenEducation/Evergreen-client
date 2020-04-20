import React from 'react';
import AuthService from 'services/AuthService';
import {useParams, Redirect, useLocation} from 'react-router-dom';
import {Spin} from 'antd';

import axiosInstance from 'services/AxiosInstance';
import useAxios, {configure} from 'axios-hooks';
import RoleSelectionScreen from 'screens/RoleSelectionScreen';
import EmailNotVerifiedScreen from 'screens/EmailNotVerifiedScreen';

configure({
  axios: axiosInstance,
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function UserAuth({user_id}) {
  const [{data: myProfile, loading, error}] = useAxios(`/users/${user_id}`);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  } else if (error) {
    return <Redirect to={{pathname: '/error/500'}} />;
  } else {
    AuthService.setCurrentSession({
      ...myProfile,
    });

    if (!myProfile.role) {
      return <Redirect to={{pathname: 'role_selection'}} />;
    }

    switch (myProfile.role) {
      case 'provider':
        return (
          <Redirect to={{pathname: `/provider/${myProfile.provider_id}`}} />
        );
      case 'admin':
        return <Redirect to={{pathname: '/admin'}} />;
      case 'student':
        return <Redirect to={{pathname: '/student'}} />;
      default:
        return <Redirect to={{pathname: '/'}} />;
    }
  }
}

function Auth() {
  const params = useParams();
  const {action} = params;
  const query = useQuery();
  const user_id = query.get('user_id');

  switch (action) {
    case 'email_not_verified':
      return <EmailNotVerifiedScreen />;
    case 'role_selection':
      return <RoleSelectionScreen />;
    case 'logout':
      AuthService.logout();
      return <div />;
    case 'user':
      if (!user_id) {
        return <Redirect to={{pathname: '/error/500'}} />;
      }
      return <UserAuth user_id={user_id} />;
    default:
      return <Redirect to={{pathname: '/'}} />;
  }
}

export default Auth;
