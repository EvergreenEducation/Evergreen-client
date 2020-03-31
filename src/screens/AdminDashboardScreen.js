import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { Layout, Button, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Sidebar from 'components/Sidebar';

import ProviderStore from 'store/Provider';
import TypeStore from 'store/Type';
import TopicContainer from 'components/topic/TopicContainer';
import 'scss/antd-overrides.scss';

const ProviderTypeContainer = imported(() => import('components/provider/ProviderTypeContainer'));
// const PathwayForm = imported(() => import('components/pathway/PathwayForm'));
const ProviderCreationContainer = imported(() => import('components/provider/ProviderCreationContainer'));
const Modal = imported(() => import('antd/lib/modal'))
const ProviderContainer = imported(() => import('components/provider/ProviderContainer'));
const ProviderHeader = imported(() => import('components/provider/ProviderHeader'));
// const OfferCreationScreen = imported(() => import('components/offer/OfferCreationScreen'));
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
                <ProviderCreationContainer closeModal={this.handleCancel} />
            );
            HeaderContent = ProviderHeader;
        }

        // if (type === "offers") {
        //     HeaderContent = <OfferCreationScreen />;
        // }

        // if (type === "pathways") {
        //     HeaderContent = <PathwayForm />;
        // }

        return (
            <>
                <TypeStore.Provider>
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
                                        render={() => <HeaderContent createHandler={this.openModal}/>}
                                    />
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
                                    render={() => {
                                        return (
                                            <div>
                                                <ProviderTypeContainer />
                                                <TopicContainer />
                                            </div>
                                        )
                                    }}
                                />
                            </Content>
                        </Col>
                    </Layout>
                    <Modal
                        className="custom-modal"
                        title={"New Provider"}
                        visible={this.state.isModalVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        bodyStyle={{ backgroundColor: "#f0f2f5", padding: 0 }}
                        width={998}
                        footer={true}
                    >
                        { FormContent }
                    </Modal>
                </TypeStore.Provider>
            </>
        );
    }
}

export default AdminDashboardPage;
