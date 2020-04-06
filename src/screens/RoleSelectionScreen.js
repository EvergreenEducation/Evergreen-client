import React from 'react';
import { Layout, Row, Col, Card, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChalkboardTeacher, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import {
  Redirect,
} from 'react-router-dom';

import axiosInstance from 'services/AxiosInstance';
import useAxios, { configure } from 'axios-hooks'
import 'scss/screens/user-selection-screen.scss';
import AuthService from 'services/AuthService';
const { Content } = Layout;

configure({
  axios: axiosInstance
});

export default function RoleSelectionScreen() {
  let user_id = AuthService.currentSession.id;
  const [{ data, error }, updateRole ] = useAxios({
    url: `/users/${user_id}`,
    method: 'PUT'
  }, { manual: true });

  if (!user_id) {
    return <Redirect to={{ pathname: '/error/500'}}/>
  }

  if (error) {
      return <Redirect to={{ pathname: '/error/500'}}/>
  }

  if (data) {
      return <Redirect to={{ pathname: '/admin'}}/>
  }

  const doRoleUpdate = (role) => {
    updateRole({ data: {
      role
    }})
  };

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
                              onClick={() => doRoleUpdate('student')}
                          >
                              <Card
                                  className="w-72 h-88 rounded user-card flex justify-center flex-col border-none"
                                  cover={
                                      <FontAwesomeIcon
                                          className="mx-auto bordered text-blue-600 user-card__icon"
                                          style={{ fontSize: "8rem", color: "rgb(57, 107, 86)" }}
                                          icon={faUserGraduate}
                                      />
                                  }
                              >
                                  <span
                                      className="text-xl"
                                      style={{ color: "rgb(57, 107, 86)" }}
                                  >
                                      Student
                                  </span>
                              </Card>
                          </Button>
                      </Col>
                      <span className="my-auto text-center text-2xl">
                          OR
                      </span>
                      <Col className="flex justify-center">
                          <Button
                              className="h-full"
                              type="link"
                              onClick={() => doRoleUpdate('provider')}
                          >
                              <Card
                                  className="w-72 h-88 rounded user-card flex justify-center flex-col border-none"
                                  cover={
                                      <FontAwesomeIcon
                                          className="mx-auto bordered user-card__icon"
                                          style={{ fontSize: "8rem", color: "rgb(57, 107, 86)" }}
                                          icon={faChalkboardTeacher}
                                      />
                                  }
                              >
                                  <span
                                      className="text-xl"
                                      style={{ color: "rgb(57, 107, 86)" }}
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
