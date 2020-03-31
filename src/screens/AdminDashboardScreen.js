import React, { useState } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { Layout, Button, Col, Skeleton } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Sidebar from 'components/Sidebar';

import ProviderStore from 'store/Provider';
import DataFieldStore from 'store/DataField';
import TopicContainer from 'components/topic/TopicContainer';
import 'scss/antd-overrides.scss';

const ProviderTypeContainer = imported(() => import('components/provider/ProviderTypeContainer'));
const ProviderCreationContainer = imported(() => import('components/provider/ProviderCreationContainer'), {
    LoadingComponent: () => (<Skeleton className="p-6" paragraph={{ rows: 15 }} active/>),
});
const Modal = imported(() => import('antd/lib/modal'));
const ProviderContainer = imported(() => import('components/provider/ProviderContainer'));
const ProviderHeader = imported(() => import('components/provider/ProviderHeader'));
const OffersTable = imported(() => import('components/offer/OffersTable'));
const PathwaysTable = imported(() => import('components/pathway/PathwaysTable'));
const { Content, Header } = Layout;

export default function AdminDashboardPage(props) {
    const [ modalVisibility, setModalVisibility ] = useState(false);
    const [ view, setView ] = useState('providers');

    const openModal = () => {
        const { pathname } = props.location;

        let type = 'providers';

        if (pathname === '/admin/offers') {
            type = 'offers';
        }

        if (pathname === '/admin/pathways') {
            type = 'pathways';
        }

        setModalVisibility(true);
        setView(type);
    }
    
    const handleCancel = e => {
        setModalVisibility(false);
    };

    let FormContent = null;
    let HeaderContent = null;

    if (view === 'providers') {
        FormContent = (
            <ProviderCreationContainer
                closeModal={handleCancel}
            />
        );
        HeaderContent = ProviderHeader;
    }

    return (
        <>  
            <DataFieldStore.Provider>
                <ProviderStore.Provider>
                    <Route
                        exact
                        path="/admin/"
                    >
                        <Redirect to="/admin/providers"/>
                    </Route>
                    <Layout
                        className="w-full flex flex-row bg-gray-300 min-h-full overflow-y-auto"
                    >
                        <Sidebar />
                        <Col className="w-full">
                            <Header className="px-6 bg-white h-12 flex items-center">
                                <Col span={14}>
                                    <Route
                                        exact
                                        path="/admin/providers"
                                    >
                                        <HeaderContent createHandler={openModal}/>
                                    </Route>
                                </Col>
                                <Col span={10} className="flex justify-end">
                                    <Button type="link">
                                        <Link to="/auth">
                                            <FontAwesomeIcon
                                                className="text-black"
                                                icon={faSignOutAlt}
                                            />
                                        </Link>
                                    </Button>
                                </Col>
                            </Header>
                            <Content className="p-6 h-min-full">
                                <Route
                                    exact
                                    path="/admin/offers"
                                >
                                    <OffersTable />
                                </Route>
                                <Route
                                    exact
                                    path="/admin/pathways"
                                >
                                    <PathwaysTable />
                                </Route>
                                <Route
                                    exact
                                    path="/admin/providers"
                                >
                                    <ProviderContainer />
                                </Route>
                                <Route
                                    exact
                                    path="/admin/settings"
                                >
                                    <>
                                        <ProviderTypeContainer />
                                        <TopicContainer />
                                    </>
                                </Route>
                            </Content>
                        </Col>
                    </Layout>
                    <Modal
                        className="custom-modal"
                        title={"New Provider"}
                        visible={modalVisibility}
                        onCancel={handleCancel}
                        bodyStyle={{ backgroundColor: "#f0f2f5", padding: 0 }}
                        width={998}
                        footer={true}
                        forceRender={true}
                    >
                        { FormContent }
                    </Modal>
                </ProviderStore.Provider>
            </DataFieldStore.Provider>
        </>
    );
}
