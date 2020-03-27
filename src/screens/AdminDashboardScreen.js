import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';
import { Layout, Button, Col, Row, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import 'scss/antd-overrides.scss';
import Sidebar from 'components/Sidebar';

import ProviderStore from 'store/Provider';

const PathwayForm = importedComponent(() => import('components/pathway/PathwayForm'));
const Modal = importedComponent(() => import('antd/lib/modal'))
const ProviderCreationContainer = importedComponent(() => import('components/provider/ProviderCreationContainer'));
const ProviderContainer = importedComponent(() => import('components/provider/ProviderContainer'));
const ProviderHeader = importedComponent(() => import('components/provider/ProviderHeader'));
const OfferCreationScreen = importedComponent(() => import('components/offer/OfferCreationScreen'));
const OffersTable = importedComponent(() => import('components/offer/OffersTable'));
const PathwaysTable = importedComponent(() => import('components/pathway/PathwaysTable'));
const { Content, Header } = Layout;
const { Search } = Input;

class AdminDashboardPage extends Component {
    state = {
        isModalVisible: false,
        formType: "providers"
    }

    openModal = () => {
        console.log(this.props.location.pathname);

        const { pathname } = this.props.location;

        let formType = "providers";

        if (pathname === "/admin/offers") {
            formType = "offers";
        }

        if (pathname === "/admin/pathways") {
            formType = "pathways";
        }

        this.setState({
            isModalVisible: true,
            formType
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

    componentDidMount() {
        this.props.history.push('/admin/providers');
    }

    render() {
        const { formType } = this.state;
        let FormScreen = null;
        let HeaderContent = null;

        if (formType === "providers") {
            FormScreen = <ProviderCreationContainer />;
            HeaderContent = ProviderHeader;
        }

        if (formType === "offers") {
            HeaderContent = <OfferCreationScreen />;
        }

        if (formType === "pathways") {
            HeaderContent = <PathwayForm />;
        }

        return (
            <>
                <Layout className="w-full h-min-full flex flex-row bg-gray-300">
                    <Sidebar />
                    <Col className="w-full">
                        <Header className="px-6 bg-white h-12 flex items-center">
                            <Col span={12}>
                                <HeaderContent createHandler={this.openModal}/>
                            </Col>
                            <Col span={12} className="flex justify-end">
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
                                path="/admin/offers"
                                render={() => <OffersTable />}
                            />
                            <Route
                                exact
                                path="/admin/pathways"
                                render={() => <PathwaysTable />}
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
                    { FormScreen }
                </Modal>
            </>
        );
    }
}

export default AdminDashboardPage;
