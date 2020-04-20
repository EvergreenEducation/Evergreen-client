import React, { useState, useEffect } from 'react';
import AuthService from 'services/AuthService';
import { Link } from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { Layout, Button, Col, Skeleton, Tooltip, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import Sidebar from 'components/Sidebar';
import { SearchModalHeader } from 'components/shared';
import axiosInstance from 'services/AxiosInstance';

import ProviderStore from 'store/Provider';
import DataFieldStore from 'store/DataField';
import OfferStore from 'store/Offer';
import PathwayStore from 'store/Pathway';
import EnrollmentStore from 'store/Enrollment';
import 'scss/antd-overrides.scss';
import matchSorter from 'match-sorter';

import ProviderUpdateContainer from 'components/provider/ProviderUpdateContainer';
import ProviderSimpleUpdateContainer from 'components/provider/ProviderSimpleUpdateContainer';
import EnrolledOfferContainer from 'components/enrollment/EnrolledOfferContainer';
import EnrollmentTopbar from 'components/enrollment/EnrollmentTopbar';

const TopicContainer = imported(() => import('components/topic/TopicContainer'));
const ProviderTypeContainer = imported(() => import('components/provider/ProviderTypeContainer'));
const SelectOptionsContainer = imported(() => import('components/SelectOptionsContainer'));

const OfferContainer = imported(() => import('components/offer/OfferContainer'));
const OfferCreationContainer = imported(() => import('components/offer/OfferCreationContainer'), {
    LoadingComponent: () => (<Skeleton className="p-6" paragraph={{ rows: 15 }} active/>),
});
const OfferCategoryContainer = imported(() => import('components/offer/OfferCategoryContainer'));

const PathwayContainer = imported(() => import('components/pathway/PathwayContainer'));
const PathwayCreationContainer = imported(() => import('components/pathway/PathwayCreationContainer'), {
    LoadingComponent: () => (<Skeleton className="p-6" paragraph={{ rows: 15 }} active/>),
});

const { Content, Header } = Layout;

const RouteConfig = {
  'offers': {
    Header: SearchModalHeader,
    Form: OfferCreationContainer,
    Content: OfferContainer,
    title: 'New Offer / Opportunity',
    modalTitle: 'New Offer / Opportunity',
    button_title: 'OFFER'
  },
  'pathways': {
    Header: SearchModalHeader,
    Form: PathwayCreationContainer,
    Content: PathwayContainer,
    title: 'New Pathway',
    modalTitle: 'New Pathway',
    button_title: 'PATHWAY'
  },
  'settings': {
    Header: () => null,
    Form: () => null,
    title: 'Setting',
    modalTitle: 'Setting',
    Content: () => {
      return <>
        <ProviderTypeContainer />
        <OfferCategoryContainer />
        <SelectOptionsContainer />
        <TopicContainer />
      </>
    }
  },
  'enrollments': {
    Header: EnrollmentTopbar,
    Form: () => <div />,
    Content: EnrolledOfferContainer,
    title: 'Enrollment',
    modalTitle: null,
    button_title: null
  },
}

export default function ProviderDashboardScreen(props) {
  const { url: basePath } = props.match;
  const { pathname } = props.history.location;
  const [ modalVisibility, setModalVisibility ] = useState(false);
	const [ searchString, setSearchString ] = useState('');
	const [ providerModalVisibility, setProviderModalVisibility ] = useState(false);
	const [ providerSimpleModalVisibility, setProviderSimpleModalVisibility ] = useState(false);

  const [
    activateCreditAssignment,
    setActivateCreditAssignment,
  ] = useState(false);

  const myProviderId = AuthService.currentSession.provider_id;

	useEffect(() => {
    async function getProviderInfo() {
      const { data } = await axiosInstance(`/providers/${myProviderId}`);
      if (data && !data.name) {
        const modalDelay = setTimeout(() => {
          setProviderSimpleModalVisibility(true);
        }, 150);
        return () => clearTimeout(modalDelay);
      }
    }
    getProviderInfo();
	}, [myProviderId]);

  const openModal = () => {
      setModalVisibility(true);
  }
  
  const handleCancel = e => {
      setModalVisibility(false);
  };

  const search = (value) => {
      setSearchString(value);
  }

  const handleTableDataForSearch = (data, keys = ['name']) => {
      const results = matchSorter(data, searchString, { keys });
      return results;
  }

  // this return the last resourcePath
  let route = pathname.split("/").pop();

  if (!RouteConfig[route]) {
    route = 'offers'; //default route
  }

	const Component = RouteConfig[route];

    return (
        <DataFieldStore.Provider>
            <ProviderStore.Provider>
                <OfferStore.Provider>
                    <PathwayStore.Provider>
                      <EnrollmentStore.Provider>
                        <Layout
                            className="w-full flex flex-row bg-gray-300 min-h-full overflow-y-auto"
                        >
                            <Sidebar basePath={basePath} role={'provider'}/>
                            <Col className="w-full">
                                <Header className="px-6 bg-white h-12 flex items-center">
                                    <Col span={14}>
                                      <Component.Header 
                                        createHandler={openModal}
                                        title={Component.title.toUpperCase()}
                                        buttonTitle={Component.button_title}
                                        handleSearch={search}
                                        setActivateCreditAssignment={setActivateCreditAssignment}
                                        activateCreditAssignment={activateCreditAssignment}
                                      />
                                    </Col>
                                    <Col span={10} className="flex justify-end">
                                      <Tooltip title="Update my information">
                                        <Button
                                          className="rounded mr-3"
                                          type="primary"
                                          onClick={() => setProviderModalVisibility(true)}
                                        >
                                          <FontAwesomeIcon
                                            className="text-white relative"
                                            style={{ left: 2 }}
                                            icon={faUserEdit}
                                          />
                                        </Button>
                                      </Tooltip>
                                      <Button type="link">
                                        <Tooltip title="Sign out">
                                            <Link to="/auth/logout">
                                                <FontAwesomeIcon
                                                    className="text-black"
                                                    icon={faSignOutAlt}
                                                />
                                            </Link>
                                        </Tooltip>
                                      </Button>
                                    </Col>
                                </Header>
                                <Content className="p-6 h-min-full">
                                  <Component.Content 
                                    handleTableData={handleTableDataForSearch}
                                    scopedToProvider={true}
                                    provider_id={myProviderId}
                                    basePath={basePath}
                                    activateCreditAssignment={activateCreditAssignment}
                                  /> 
                                </Content>
                            </Col>
                        </Layout>
                        <Modal
                          className="custom-modal"
                          title={Component.modalTitle}
                          visible={modalVisibility}
                          onCancel={handleCancel}
                          style={{ borderRadius: 5 }}
                          bodyStyle={{ backgroundColor: "#f0f2f5", padding: 0 }}
                          width={998}
                          footer={true}
                          forceRender={true}
                        >
                          {
                            modalVisibility && (
                              <Component.Form
                                closeModal={handleCancel}
                                scopedToProvider={true}
                              />
                            )
                          }
                        </Modal>
                        <ProviderUpdateContainer
                          provider_id={myProviderId}
                          visible={providerModalVisibility}
                          onCancel={() => setProviderModalVisibility(false)}
                        />
                        <ProviderSimpleUpdateContainer
                          provider_id={myProviderId}
                          visible={providerSimpleModalVisibility}
                          onCancel={() => setProviderSimpleModalVisibility(false)}
                        />
                      </EnrollmentStore.Provider>
                    </PathwayStore.Provider>
                </OfferStore.Provider>
            </ProviderStore.Provider>
        </DataFieldStore.Provider>
    );
}
