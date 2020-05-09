import React, { useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Button,
  Popover,
  Input,
  Checkbox,
  Select,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignInAlt,
  faUser,
  faArrowLeft,
  faSearch,
  faClipboardList,
  faTimes,
  faHome,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { GlobalProvider } from 'store/GlobalStore';
import { TopicCarouselContainer } from 'components/student';
import {
  Route,
  withRouter,
  useRouteMatch,
  useHistory,
  Link,
} from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import AuthService from 'services/AuthService';
import Logo from 'assets/svgs/evergreen-optimized-logo.svg';
import './home-screen.scss';

const { Header, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const OfferInfoContainer = imported(() =>
  import('components/student/OfferInfoContainer')
);

const ProviderInfoContainer = imported(() =>
  import('components/student/ProviderInfoContainer')
);

const PathwayInfoContainer = imported(() =>
  import('components/student/PathwayInfoContainer')
);

const StudentDashboard = imported(() =>
  import('components/student/StudentDashboard/StudentDashboard')
);

function HomeScreen() {
  const [toggeables, setToggeables] = useState({
    search: false,
    studentDashboard: false,
  });
  let match = useRouteMatch();
  const history = useHistory();

  const session = AuthService.currentSession;

  return (
    <GlobalProvider>
      <Layout className="homeScreen h-full bg-gray-100">
        <div className="w-full bg-gray-100" style={{ paddingBottom: 48 }}>
          <Content className="homeScreen__carouselContent mx-auto h-auto bg-gray-100">
            {(!toggeables.studentDashboard && (
              <>
                <Route exact path={`${match.url}`}>
                  <TopicCarouselContainer />
                </Route>
                <Route
                  path={`${match.url}/offer/:id`}
                  component={(props) => (
                    <OfferInfoContainer {...props} session={session} />
                  )}
                />
                <Route
                  path={`${match.url}/pathway/:id`}
                  component={(props) => (
                    <PathwayInfoContainer {...props} session={session} />
                  )}
                />
                <Route
                  path={`${match.url}/provider/:id`}
                  component={ProviderInfoContainer}
                />
              </>
            )) ||
              (session && session.role === 'student' && (
                <StudentDashboard
                  session={session}
                  toggeables={toggeables}
                  setToggeables={setToggeables}
                />
              ))}
          </Content>
        </div>
        <Header className="homeScreen__navWrapper h-12 w-full bg-green-500 fixed bottom-0 z-10">
          <Row className="homeScreen__navbar mx-auto h-full">
            <Col
              span={!toggeables.search ? 8 : 8}
              className="flex items-center"
            >
              <div className="inherit">
                <Button
                  className="mr-2"
                  type="primary"
                  shape="circle"
                  onClick={() => history.goBack()}
                >
                  <FontAwesomeIcon className="text-white" icon={faArrowLeft} />
                </Button>
                <Button
                  className="homeScreen__homeButton mr-2"
                  type="primary"
                  shape="circle"
                >
                  {' '}
                  <Link to="/">
                    <FontAwesomeIcon className="text-white" icon={faHome} />
                  </Link>
                </Button>
                {!toggeables.search && (
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={() =>
                      setToggeables({
                        ...toggeables,
                        search: true,
                      })
                    }
                  >
                    <FontAwesomeIcon className="text-white" icon={faSearch} />
                  </Button>
                )}
                {toggeables.search && (
                  <>
                    <Button
                      danger
                      type="primary"
                      shape="circle"
                      onClick={() =>
                        setToggeables({
                          ...toggeables,
                          search: false,
                        })
                      }
                    >
                      <FontAwesomeIcon className="text-white" icon={faTimes} />
                    </Button>
                  </>
                )}
              </div>
            </Col>
            <Col
              span={!toggeables.search ? 8 : 11}
              className="flex justify-center items-center h-full"
            >
              {(!toggeables.search && (
                <Row className="flex justify-center items-center">
                  <img
                    className="homeScreen__brandLogo relative mr-1"
                    src={Logo}
                    alt="logo"
                  />
                  <span className="homeScreen__brandName font-bold flex items-center">
                    EVERGREEN
                  </span>
                </Row>
              )) || (
                <div className="flex flex-row">
                  <Search
                    className="rounded-l rounded-r-none"
                    style={{ width: '75%' }}
                  />
                  <Popover
                    trigger="click"
                    placement="topRight"
                    content={
                      <div className="flex flex-col">
                        <div>
                          <Checkbox>Learn</Checkbox>
                          <Checkbox>Earn</Checkbox>
                        </div>
                        <Select className="mt-1" defaultValue="all">
                          <Option value="all">All</Option>
                          <Option value="providers">Providers</Option>
                          <Option value="offers">Offers</Option>
                          <Option value="pathways">Pathways</Option>
                        </Select>
                      </div>
                    }
                  >
                    <Button
                      className="flex justify-center rounded-l-none rounded-r"
                      type="primary"
                      style={{ width: '25%' }}
                    >
                      <FontAwesomeIcon className="text-white" icon={faFilter} />
                    </Button>
                  </Popover>
                </div>
              )}
            </Col>
            <Col
              span={!toggeables.search ? 8 : 5}
              className="flex justify-end items-center h-full"
            >
              {(session && session.role === 'student' && (
                <div>
                  <Button
                    type="primary"
                    shape="circle"
                    className={`mr-2 ${
                      toggeables.studentDashboard ? 'antd-btn-active' : ''
                    }`}
                    onClick={() =>
                      setToggeables({
                        search: false,
                        studentDashboard: !toggeables.studentDashboard,
                      })
                    }
                  >
                    <FontAwesomeIcon
                      className="text-white"
                      icon={faClipboardList}
                    />
                  </Button>
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
                </div>
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
