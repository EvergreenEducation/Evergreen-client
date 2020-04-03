import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { Layout, Button, Col, Skeleton, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Sidebar from 'components/Sidebar';
import { SearchModalHeader } from 'components/shared';

import ProviderStore from 'store/Provider';
import DataFieldStore from 'store/DataField';
import 'scss/antd-overrides.scss';

const Modal = imported(() => import('antd/lib/modal'));

const TopicContainer = imported(() => import('components/topic/TopicContainer'));
const ProviderTypeContainer = imported(() => import('components/provider/ProviderTypeContainer'));
const SelectOptionsContainer = imported(() => import('components/SelectOptionsContainer'));

const ProviderCreationContainer = imported(() => import('components/provider/ProviderCreationContainer'), {
    LoadingComponent: () => (<Skeleton className="p-6" paragraph={{ rows: 15 }} active/>),
});

const ProviderContainer = imported(() => import('components/provider/ProviderContainer'));

const OfferContainer = imported(() => import('components/offer/OfferContainer'));
const OfferCreationContainer = imported(() => import('components/offer/OfferCreationContainer'));
const OfferCategoryContainer = imported(() => import('components/offer/OfferCategoryContainer'));

const PathwaysTable = imported(() => import('components/pathway/PathwaysTable'));

const { Content, Header } = Layout;

export default function AdminDashboardPage(props) {
    const history = useHistory();
    const { pathname } = props.location;
    const [ modalVisibility, setModalVisibility ] = useState(false);
    
    let HeaderContent = () => null;
    let FormContent = () => null;
    let MainContent = () => null;
    let modalTitle = '';

    const openModal = () => {
        setModalVisibility(true);
    }
    
    const handleCancel = e => {
        setModalVisibility(false);
    };

    if (pathname === '/admin') {
        history.replace('/admin/providers');
    }

    if (pathname === '/admin/offers') {
        modalTitle = 'New Offer / Opportunity';
        HeaderContent = () => null;
        HeaderContent = () => (
            <SearchModalHeader
                createHandler={openModal}
                title="OFFERS / OPPORTUNITIES"
                buttonTitle="OFFER"
            />
        );
        FormContent = (<OfferCreationContainer closeModal={handleCancel} />);
        MainContent = () => <OfferContainer />;
    }

    if (pathname === '/admin/pathways') {
        HeaderContent = () => null;
        FormContent = () => null;
        MainContent = () => <PathwaysTable />;
    }

    if (pathname === '/admin/providers') {
        modalTitle = 'New Provider';
        FormContent = (
            <ProviderCreationContainer
                closeModal={handleCancel}
            />
        );
        HeaderContent = () => (
            <SearchModalHeader
                createHandler={openModal}
                title="PROVIDERS"
                buttonTitle="PROVIDER"
            />
        );
        MainContent = () => <ProviderContainer />;
    }

    if (pathname === '/admin/settings') {
        MainContent = () => (
            <>
                <ProviderTypeContainer />
                <OfferCategoryContainer />
                <SelectOptionsContainer />
                <TopicContainer />
            </>
        );
    }

    return (
        <DataFieldStore.Provider>
            <ProviderStore.Provider>
                <Layout
                    className="w-full flex flex-row bg-gray-300 min-h-full overflow-y-auto"
                >
                    <Sidebar pathname={pathname} />
                    <Col className="w-full">
                        <Header className="px-6 bg-white h-12 flex items-center">
                            <Col span={14}>
                                <HeaderContent />
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
                            <MainContent />
                        </Content>
                    </Col>
                </Layout>
                <Modal
                    className="custom-modal"
                    title={modalTitle}
                    visible={modalVisibility}
                    onCancel={handleCancel}
                    style={{ borderRadius: 5 }}
                    bodyStyle={{ backgroundColor: "#f0f2f5", padding: 0 }}
                    width={998}
                    footer={true}
                    forceRender={true}
                >
                    { FormContent }
                </Modal>
            </ProviderStore.Provider>
        </DataFieldStore.Provider>
    );
}
