import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { Layout, Button, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import 'scss/antd-overrides.scss';
import Sidebar from 'components/Sidebar';

import ProviderStore from 'store/Provider';
import ProviderTypeStore from 'store/ProviderType';

const PathwayForm = imported(() => import('components/pathway/PathwayForm'));
const Modal = imported(() => import('antd/lib/modal'))
const ProviderTypeContainer = imported(() => import('components/provider/ProviderTypeContainer'));
const ProviderCreationContainer = imported(() => import('components/provider/ProviderCreationContainer'));
const ProviderContainer = imported(() => import('components/provider/ProviderContainer'));
const ProviderHeader = imported(() => import('components/provider/ProviderHeader'));
const OfferCreationScreen = imported(() => import('components/offer/OfferCreationScreen'));
const OffersTable = imported(() => import('components/offer/OffersTable'));
const PathwaysTable = imported(() => import('components/pathway/PathwaysTable'));
const { Content, Header } = Layout;

class AdminDashboardPage extends Component {
    state = {
        isModalVisible: false,
        type: "providers"
    }

    openModal = () => {
        const { pathname } = this.props.location;

        let type = "providers";

        if (pathname === "/admin/offers") {
            type = "offers";
        }

        if (pathname === "/admin/pathways") {
            type = "pathways";
        }

        this.setState({
            isModalVisible: true,
            type
        })
    }

    handleOk = e => {
        this.setState({
          isModalVisible: false
        });
    };
    
    handleCancel = e => {
        this.setState({
            isModalVisible: false
        });
    };

    render() {
        const { type } = this.state;
        let FormContent = null;
        let HeaderContent = null;

        if (type === "providers") {
            FormContent = (
                // <ProviderTypeStore.Provider>
                    <ProviderCreationContainer />
                // </ProviderTypeStore.Provider>
            );
            HeaderContent = ProviderHeader;
        }

        if (type === "offers") {
            HeaderContent = <OfferCreationScreen />;
        }

        if (type === "pathways") {
            HeaderContent = <PathwayForm />;
        }

        return (
            <>
                <ProviderTypeStore.Provider>
                    <Route
                        exact
                        path="/admin/"
                    >
                        <Redirect to="/admin/providers"/>
                    </Route>
                    <Layout className="w-full flex flex-row bg-gray-300" style={{ height: "100%" }}>
                        <Sidebar />
                        <Col className="w-full">
                            <Header className="px-6 bg-white h-12 flex items-center">
                                <Col span={14}>
                                    <HeaderContent createHandler={this.openModal}/>
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
                                    render={() => <OffersTable />}
                                />
                                <Route
                                    exact
                                    path="/admin/pathways"
                                    render={() => <PathwaysTable />}
                                />
                                <Route
                                    exact
                                    path="/admin/providers"
                                    render={() => (
                                        <ProviderStore.Provider>
                                            <ProviderContainer />
                                        </ProviderStore.Provider>
                                    )
                                    }
                                />
                                <Route
                                    exact
                                    path="/admin/settings"
                                    render={() => (
                                        // <ProviderTypeStore.Provider>
                                            <ProviderTypeContainer />
                                        // </ProviderTypeStore.Provider>
                                    )}
                                />
                            </Content>
                        </Col>
                    </Layout>
                    <Modal
                        title={"New Provider"}
                        visible={this.state.isModalVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        bodyStyle={{ backgroundColor: "#f0f2f5" }}
                        width={998}
                        footer={[
                            <Button
                                key="submit"
                                type="primary"
                                onClick={this.getFormData}
                            >
                            Create
                            </Button>,
                            <Button
                                key="back"
                                onClick={this.handleCancel}
                            >
                            Close
                            </Button>,
                        ]}
                    >
                        { FormContent }
                    </Modal>

                </ProviderTypeStore.Provider>
            </>
        );
    }
}

export default AdminDashboardPage;
