import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';
import { Layout, Button, Col, Row, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlusCircle, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
import 'scss/antd-overrides.scss';
import Sidebar from 'components/Sidebar';

const PathwayForm = importedComponent(() => import('components/PathwayForm'));
const Modal = importedComponent(() => import('antd/lib/modal'))
const ProviderCreationScreen = importedComponent(() => import('screens/ProviderCreationScreen'));
const OfferCreationScreen = importedComponent(() => import('screens/OfferCreationScreen'));
const ProvidersScreen = importedComponent(() => import('screens/ProvidersScreen'));
const OffersScreen = importedComponent(() => import('screens/OffersScreen'));
const PathwaysScreen = importedComponent(() => import('screens/PathwaysScreen'));
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

        if (formType === "providers") {
            FormScreen = <ProviderCreationScreen />;
        }

        if (formType === "offers") {
            FormScreen = <OfferCreationScreen />;
        }

        if (formType === "pathways") {
            FormScreen = <PathwayForm />;
        }

        return (
            <>
                <Layout className="w-full h-min-full flex flex-row bg-gray-300">
                    <Sidebar />
                    <Col className="w-full">
                        <Header className="px-6 bg-white h-12 flex items-center">
                            <Col span={12}>
                                <Route
                                    exact
                                    path="/admin/providers"
                                    render={() => (
                                        <Row className="items-center">
                                            <span className="mr-2">PROVIDERS</span>
                                            <Search
                                                onSearch={value => console.log(value)}
                                                enterButton
                                                className="w-56 h-8 custom-search mr-2"
                                            />
                                            <Button
                                                type="primary"
                                                onClick={this.openModal}
                                            >
                                                <FontAwesomeIcon
                                                    className="text-white mr-1"
                                                    icon={faPlusCircle}
                                                />
                                                PROVIDER
                                            </Button>
                                        </Row>
                                    )}
                                />
                                <Route
                                    exact
                                    path="/admin/offers"
                                    render={() => (
                                        <Row className="items-center">
                                            <span className="mr-2">OFFERS / OPPORTUNITIES</span>
                                            <Search
                                                onSearch={value => console.log(value)}
                                                enterButton
                                                className="w-56 h-8 custom-search mr-2"
                                            />
                                            <Button
                                                type="primary"
                                                onClick={this.openModal}
                                            >
                                                <FontAwesomeIcon
                                                    className="text-white mr-1"
                                                    icon={faPlusCircle}
                                                />
                                                OFFER
                                            </Button>
                                        </Row>
                                    )}
                                />
                                <Route
                                    exact
                                    path="/admin/pathways"
                                    render={() => (
                                        <Row className="items-center">
                                            <span className="mr-2">PATHWAYS</span>
                                            <Search
                                                onSearch={value => console.log(value)}
                                                enterButton
                                                className="w-56 h-8 custom-search mr-2"
                                            />
                                            <Button
                                                type="primary"
                                                onClick={this.openModal}
                                            >
                                                <FontAwesomeIcon
                                                    className="text-white mr-1"
                                                    icon={faPlusCircle}
                                                />
                                                PATHWAY
                                            </Button>
                                        </Row>
                                    )}
                                />
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
                                render={() => <ProvidersScreen />}
                            />
                            <Route
                                exact
                                path="/admin/offers"
                                render={() => <OffersScreen />}
                            />
                            <Route
                                exact
                                path="/admin/pathways"
                                render={() => <PathwaysScreen />}
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