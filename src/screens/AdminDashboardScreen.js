import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
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
import EnrolledOfferContainer from 'components/enrollment/EnrolledOfferContainer';

const TopicContainer = imported(() => import('components/topic/TopicContainer'));
const ProviderTypeContainer = imported(() => import('components/provider/ProviderTypeContainer'));
const SelectOptionsContainer = imported(() => import('components/SelectOptionsContainer'));

const ProviderCreationContainer = imported(() => import('components/provider/ProviderCreationContainer'), {
    LoadingComponent: () => (<Skeleton className="p-6" paragraph={{ rows: 15 }} active/>),
});

const ProviderContainer = imported(() => import('components/provider/ProviderContainer'));

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

export default function AdminDashboardPage(props) {
    const history = useHistory();
    const { pathname } = props.location;
    const [ modalVisibility, setModalVisibility ] = useState(false);
    const [ searchString, setSearchString ] = useState('');
    
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

    const search = (value) => {
        setSearchString(value);
    }

    const handleTableDataForSearch = (data, keys = ['name']) => {
        const results = matchSorter(data, searchString, { keys });
        return results;
    }

    if (pathname === '/admin') {
        history.replace('/admin/providers');
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
                handleSearch={search}
            />
        );
        MainContent = () => (
            <ProviderContainer
                handleTableData={handleTableDataForSearch}
            />
        );
    }

    if (pathname === '/admin/offers') {
        modalTitle = 'New Offer / Opportunity';
        HeaderContent = () => (
            <SearchModalHeader
                createHandler={openModal}
                title="OFFERS / OPPORTUNITIES"
                buttonTitle="OFFER"
                handleSearch={search}
            />
        );
        FormContent = (<OfferCreationContainer closeModal={handleCancel} />);
        MainContent = () => (
            <OfferContainer
                handleTableData={handleTableDataForSearch}
            />
        );
    }

    if (pathname === '/admin/pathways') {
        modalTitle = 'New Pathway';
        HeaderContent = () => (
            <SearchModalHeader
                createHandler={openModal}
                title="PATHWAYS"
                buttonTitle="PATHWAY"
                handleSearch={search}
            />
        );
        FormContent = (
            <PathwayCreationContainer
                closeModal={handleCancel}
            />
        );
        MainContent = () => (
            <PathwayContainer
                handleTableData={handleTableDataForSearch}
            />
        );
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

    if (pathname === '/admin/enrolled_offers') {
        modalTitle = 'New Offer / Opportunity';
        HeaderContent = () => (
            <SearchModalHeader
                createHandler={openModal}
                title="Enrolled Offers"
                buttonTitle="OFFER"
                handleSearch={search}
            />
        );
        FormContent = (<OfferCreationContainer closeModal={handleCancel} />);
        MainContent = () => (
            <EnrolledOfferContainer
                handleTableData={handleTableDataForSearch}
            />
        );
    }

    return (
        <DataFieldStore.Provider>
            <ProviderStore.Provider>
                <OfferStore.Provider>
                    <PathwayStore.Provider>
                        <Layout
                            className="w-full flex flex-row bg-gray-300 min-h-full overflow-y-auto"
                        >
                            <Sidebar basePath={'/admin'} role={'admin'}/>
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
                    </PathwayStore.Provider>
                </OfferStore.Provider>
            </ProviderStore.Provider>
        </DataFieldStore.Provider>
    );
}
