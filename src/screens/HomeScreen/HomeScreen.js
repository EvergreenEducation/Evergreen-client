import React, { useState, useEffect } from 'react';
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
  faTimes,
  faHome,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { TopicCarouselContainer } from 'components/student';
import PromoCarouselsContainer from 'components/promotion/PromoCarouselsContainer/PromoCarouselsContainer';
import {
  Route,
  withRouter,
  useRouteMatch,
  useHistory,
  Link,
  Redirect,
} from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import matchSorter from 'match-sorter';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import AuthService from 'services/AuthService';
import useGlobalStore from 'store/GlobalStore';
import Logo from 'assets/svgs/evergreen-optimized-logo.svg';
import './home-screen.scss';

configure({
  axios: axiosInstance,
});

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

const SearchResultContainer = imported(() =>
  import('components/SearchResultContainer/SearchResultContainer')
);

function HomeScreen() {
  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState({
    offer: true,
    pathway: true,
    provider: true,
  });
  const {
    provider: providerStore,
    pathway: pathwayStore,
    offer: offerStore,
  } = useGlobalStore();
  const [toggeables, setToggeables] = useState({
    search: false,
    popover: false,
  });

  const handleVisibleChange = (visible) => {
    setToggeables({
      ...toggeables,
      popover: visible,
    });
  };

  let match = useRouteMatch();
  const history = useHistory();

  const session = AuthService.currentSession;

  const [{ data: getPathways }] = useAxios('/pathways?scope=with_files');

  const [{ data: getOffers }] = useAxios('/offers?scope=with_files');

  const [{ data: getProviders }] = useAxios('/providers?scope=with_files');

  const offers = Object.values(offerStore.entities).map((o) => {
    return { ...o, entity_type: 'offer' };
  });

  const providers = Object.values(providerStore.entities).map((p) => {
    return { ...p, entity_type: 'provider' };
  });

  const pathways = Object.values(pathwayStore.entities).map((p) => {
    return { ...p, entity_type: 'pathway' };
  });

  const data = [...offers, ...pathways, ...providers];

  const handleSearch = (e) => {
    if (!e) {
      return '';
    }
    setSearchString(e.target.value);
    if (searchString.length > 0) {
      setToggeables({
        ...toggeables,
        isSearching: true,
      });
    } else {
      setToggeables({
        ...toggeables,
        isSearching: false,
      });
    }
    return searchString;
  };

  const handleDataAfterSearch = (data, keys = ['name']) => {
    return matchSorter(data, searchString, { keys });
  };

  let showData = handleDataAfterSearch(data);

  useEffect(() => {
    if (getPathways) {
      pathwayStore.addMany(getPathways);
    }
    if (getOffers) {
      offerStore.addMany(getOffers);
    }
    if (getProviders) {
      providerStore.addMany(getProviders);
    }
  }, [getPathways, getOffers, getProviders]);

  const { search, popover } = toggeables;

  return (
    <Layout className="homeScreen h-full bg-gray-100">
      <div className="w-full bg-gray-100" style={{ paddingBottom: 48 }}>
        <Content className="homeScreen__carouselContent mx-auto h-auto bg-gray-100">
          {(!search && (
            <>
              <Route exact path={`${match.url}`}>
                <PromoCarouselsContainer />
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
              <Route exact path={`${match.url}/student`}>
                {(session && session.role === 'student' && (
                  <StudentDashboard
                    session={session}
                    toggeables={toggeables}
                    setToggeables={setToggeables}
                  />
                )) || <Redirect to="/error/401" />}
              </Route>
            </>
          )) || (
            <SearchResultContainer
              data={showData}
              setToggeables={setToggeables}
              toggeables={toggeables}
            />
          )}
        </Content>
      </div>
      <Header className="homeScreen__navWrapper h-12 w-full bg-green-500 fixed bottom-0 z-10">
        <Row className="homeScreen__navbar mx-auto h-full">
          <Col span={!search ? 8 : 6} className="flex items-center">
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
              {!search && (
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
              {search && (
                <>
                  <Button
                    danger
                    type="primary"
                    shape="circle"
                    onClick={() =>
                      setToggeables({
                        ...toggeables,
                        search: false,
                        isSearching: false,
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
            span={!search ? 8 : 16}
            className="flex justify-center items-center h-full"
          >
            {(!search && (
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
                  className="rounded-l rounded-r-none custom-searchbox"
                  onChange={handleSearch}
                  addonAfter={
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
                      <div className="h-full w-full px-3">
                        <FontAwesomeIcon
                          className="text-white"
                          icon={faFilter}
                        />
                      </div>
                    </Popover>
                  }
                />
              </div>
            )}
          </Col>
          <Col
            span={!toggeables.search ? 8 : 2}
            className="flex justify-end items-center h-full"
          >
            {(session && session.role === 'student' && (
              <div>
                <Popover
                  trigger="click"
                  placement="topRight"
                  visible={popover}
                  onVisibleChange={handleVisibleChange}
                  content={
                    <div className="flex flex-col items-start">
                      <Link
                        to={`${match.url}/student`}
                        style={{ borderBottom: '1px solid #edf2f7' }}
                        onClick={() =>
                          setToggeables({
                            ...toggeables,
                            search: false,
                            popover: false,
                          })
                        }
                      >
                        <Button
                          type="link"
                          className="py-0 px-0 pr-6 text-gray-500"
                          size="small"
                        >
                          User Pathway
                        </Button>
                      </Link>
                      <Button
                        type="link"
                        disabled
                        className="py-0 px-0 pr-6 text-gray-500"
                        size="small"
                      >
                        Settings
                      </Button>
                      <Button
                        type="link"
                        className="py-0 px-0 pr-6 text-gray-500"
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
  );
}

export default withRouter(HomeScreen);
