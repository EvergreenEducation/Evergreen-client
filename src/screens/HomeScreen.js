import React from 'react';
import { Layout, Row, Col, Button, Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { GlobalProvider } from 'store/GlobalStore';
import { TopicCarouselContainer } from 'components/student';
import { Route, withRouter, useRouteMatch } from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import AuthService from 'services/AuthService';
import Logo from 'assets/svgs/evergreen-optimized-logo.svg';
import 'scss/screens/home-screen.scss';

const { Header, Content } = Layout;

const OfferInfoContainer = imported(() =>
  import('components/student/OfferInfoContainer')
);

const ProviderInfoContainer = imported(() =>
  import('components/student/ProviderInfoContainer')
);

const PathwayInfoContainer = imported(() =>
  import('components/student/PathwayInfoContainer')
);

function HomeScreen() {
  let match = useRouteMatch();

  const session = AuthService.currentSession;

  return (
    <GlobalProvider>
      <Layout className="h-full bg-gray-100">
        <div className="w-full bg-gray-100" style={{ paddingBottom: 48 }}>
          <Content
            className="mx-auto max-w-4xl h-auto bg-gray-100"
            style={{ width: 423 }}
          >
            <Route exact path={`${match.url}`}>
              <TopicCarouselContainer />
            </Route>
            <Route
              path={`${match.url}/offer/:id`}
              component={OfferInfoContainer}
            />
            <Route
              path={`${match.url}/provider/:id`}
              component={ProviderInfoContainer}
            />
            <Route
              path={`${match.url}/pathway/:id`}
              component={PathwayInfoContainer}
            />
          </Content>
        </div>
        <Header className="h-12 w-full bg-green-500 fixed bottom-0 z-10">
          <Row className="mx-auto max-w-4xl h-full" style={{ width: 423 }}>
            <Col span={8} />
            <Col span={8} className="flex justify-center items-center h-full">
              <Row className="h-full p-1">
                <img
                  className="relative mr-1"
                  style={{
                    paddingRight: 3,
                    paddingLeft: 3,
                    backgroundColor: 'darkgreen',
                    borderRadius: '50%',
                    height: '90%',
                    top: 2,
                  }}
                  src={Logo}
                  alt="logo"
                />
                <span
                  className="font-bold relative h-full flex items-center"
                  style={{ color: 'darkgreen' }}
                >
                  EVERGREEN
                </span>
              </Row>
            </Col>
            <Col span={8} className="flex justify-end items-center h-full">
              {/* {!session.length && !session.role && ( */}
              {/* )} */}
              {(session && session.role === 'student' && (
                <Popover
                  trigger="click"
                  placement="topRight"
                  content={
                    <div>
                      <Button
                        type="link"
                        disabled
                        className="py-0 pr-16 text-gray-500"
                        size="small"
                      >
                        Settings
                      </Button>
                      <hr />
                      <Button
                        type="link"
                        className="py-0 pr-16 text-gray-500"
                        size="small"
                        onClick={() => AuthService.logout()}
                      >
                        Sign out
                      </Button>
                    </div>
                  }
                >
                  <Button type="primary" shape="circle">
                    <FontAwesomeIcon className="text-white" icon={faUser} />
                  </Button>
                </Popover>
              )) || (
                <Button
                  type="primary"
                  shape="circle"
                  onClick={() => {
                    window.location.replace(
                      `${process.env.REACT_APP_API_URL}/login`
                    );
                  }}
                >
                  <FontAwesomeIcon className="text-white" icon={faSignInAlt} />
                </Button>
              )}
            </Col>
          </Row>
        </Header>
      </Layout>
    </GlobalProvider>
  );
}

export default withRouter(HomeScreen);
