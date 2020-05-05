import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChalkboardTeacher,
  faUserGraduate,
} from '@fortawesome/free-solid-svg-icons';

import axiosInstance from 'services/AxiosInstance';
import 'scss/screens/user-selection-screen.scss';
import AuthService from 'services/AuthService';
import { get } from 'lodash';

import { Layout, Row, Col, Card, Button } from 'antd';
const { Content } = Layout;

function RoleSelectionScreen(props) {
  const { history, location } = props;

  const user_id = get(location, 'state.user_id');

  if (!user_id) {
    return <Redirect to={{ pathname: '/' }} />;
  }

  const createUserProfile = async (role) => {
    try {
      let user;
      if (role === 'provider') {
        const { data } = await axiosInstance.post('/providers', {
          user_id,
        });
        ({ data: user } = await axiosInstance.put(`/users/${user_id}`, {
          role,
          provider_id: data.id,
        }));
      } else {
        const { data } = await axiosInstance.post('/students', {
          user_id,
        });
        ({ data: user } = await axiosInstance.put(`/users/${user_id}`, {
          role,
          student_id: data.id,
        }));

        AuthService.setCurrentSession(user);
        history.push(`/`);
        return;
      }

      AuthService.setCurrentSession(user);
      history.push(`/dashboard/${user.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  if (!user_id) {
    return <Redirect to={{ pathname: '/error/500' }} />;
  }

  return (
    <Layout className="h-full bg-green-500">
      <div className="w-full bg-green-500">
        <Content className="mx-auto max-w-4xl h-full bg-green-500 flex items-center flex-col justify-center selection">
          <h2 className="text-2xl mt-12 mb-6 question font-medium">
            Are you are a . . .
          </h2>
          <Row className="w-full justify-around user-selection-row">
            <Col className="flex justify-center">
              <Button
                className="h-full"
                type="link"
                onClick={() => createUserProfile('student')}
              >
                <Card
                  className="w-72 h-88 rounded user-card flex justify-center flex-col border-none"
                  cover={
                    <FontAwesomeIcon
                      className="mx-auto bordered text-blue-600 user-card__icon"
                      style={{ fontSize: '8rem', color: 'rgb(57, 107, 86)' }}
                      icon={faUserGraduate}
                    />
                  }
                >
                  <span
                    className="text-xl"
                    style={{ color: 'rgb(57, 107, 86)' }}
                  >
                    Student
                  </span>
                </Card>
              </Button>
            </Col>
            <span className="my-auto text-center text-2xl">OR</span>
            <Col className="flex justify-center">
              <Button
                className="h-full"
                type="link"
                onClick={() => createUserProfile('provider')}
              >
                <Card
                  className="w-72 h-88 rounded user-card flex justify-center flex-col border-none"
                  cover={
                    <FontAwesomeIcon
                      className="mx-auto bordered user-card__icon"
                      style={{ fontSize: '8rem', color: 'rgb(57, 107, 86)' }}
                      icon={faChalkboardTeacher}
                    />
                  }
                >
                  <span
                    className="text-xl"
                    style={{ color: 'rgb(57, 107, 86)' }}
                  >
                    Provider
                  </span>
                </Card>
              </Button>
            </Col>
          </Row>
        </Content>
      </div>
    </Layout>
  );
}

export default withRouter(RoleSelectionScreen);
