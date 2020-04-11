import React, { useState } from 'react';
import AuthService from 'services/AuthService';
import { Link } from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { Layout, Button, Col, Skeleton, Tooltip, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Sidebar from 'components/Sidebar';
import { SearchModalHeader } from 'components/shared';

import ProviderStore from 'store/Provider';
import DataFieldStore from 'store/DataField';
import OfferStore from 'store/Offer';
import PathwayStore from 'store/Pathway';
import 'scss/antd-overrides.scss';
import matchSorter from 'match-sorter';

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
    button_title: 'OFFER'
  },
  'pathways': {
    Header: SearchModalHeader,
    Form: PathwayCreationContainer,
    Content: PathwayContainer,
    title: 'New Pathway',
    button_title: 'PATHWAY'
  },
  'settings': {
    Header: () => null,
    Form: () => null,
    title: 'Setting',
    Content: () => {
      return <>
        <ProviderTypeContainer />
        <OfferCategoryContainer />
        <SelectOptionsContainer />
        <TopicContainer />
      </>
    }
  }
}

export default function ProviderDashboardScreen(props) {
    const { url: basePath } = props.match;
    const { pathname } = props.history.location;
    const [ modalVisibility, setModalVisibility ] = useState(false);
    const [ searchString, setSearchString ] = useState('');

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
                                      />
                                    </Col>
                                    <Col span={10} className="flex justify-end">
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
                                  /> 
                                </Content>
                            </Col>
                        </Layout>
                        <Modal
                          className="custom-modal"
                          title={Component.title}
                          visible={modalVisibility}
                          onCancel={handleCancel}
                          style={{ borderRadius: 5 }}
                          bodyStyle={{ backgroundColor: "#f0f2f5", padding: 0 }}
                          width={998}
                          footer={true}
                          forceRender={true}
                        >
                            <Component.Form provider_id={AuthService.currentSession.Provider.id}/>
                        </Modal>
                    </PathwayStore.Provider>
                </OfferStore.Provider>
            </ProviderStore.Provider>
        </DataFieldStore.Provider>
    );
}
