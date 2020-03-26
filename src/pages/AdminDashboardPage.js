import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { Layout, Menu, Button, Col, Row, Input, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBars, faDollarSign, faHandHoldingUsd,
    faTree, faRoute, faCog, faDatabase,
    faPlusCircle
} from '@fortawesome/free-solid-svg-icons'
import 'scss/antd-overrides.scss';
import ProvidersScreen from 'screens/ProvidersScreen';

const { Content, Header, Sider } = Layout;
const { Search } = Input;

class AdminDashboardPage extends Component {
    state = {
        collapsed: false,
        isModalVisible: false,
        formType: "providers"
    }

    toggleSider = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    openModal = () => {
        this.setState({
            isModalVisible: true
        })
    }

    handleOk = e => {
        console.log(e);
        this.setState({
          isModalVisible: false
        });
    };
    
    handleCancel = e => {
        console.log(e);
        this.setState({
            isModalVisible: false
        });
    };

    componentDidMount() {
        this.props.history.push('/admin/providers');
    }

    render() {
        const { collapsed } = this.state;
        return (
            <>
                <Layout className="w-full h-min-full flex flex-row bg-gray-300">
                    <Sider
                        className="h-screen bg-green-500"
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                    >
                        <div className="flex justify-center bg-green-600">
                            <Button
                                className="mx-auto h-12 w-full"
                                type="link"
                                onClick={() => this.toggleSider()}
                            >   
                                <FontAwesomeIcon
                                    className="text-white"
                                    icon={faBars}
                                />
                            </Button>
                        </div>
                        <Menu
                            className="bg-green-500"
                            theme="dark"
                            defaultSelectedKeys={['1']}
                        >
                            <Menu.Item
                                className="bg-green-500 text-center text-white bg-green-800-selected"
                                style={{ marginTop: 0, marginBottom: 0 }}
                                key="1"
                            >
                                <Link to="/admin/providers">
                                    <FontAwesomeIcon
                                        className="text-white"
                                        icon={faTree}
                                    />
                                    {
                                        collapsed ? null : " Providers"
                                    }
                                </Link>
                            </Menu.Item>
                            <Menu.Item
                                className="bg-green-500 text-center text-white bg-green-800-selected"
                                style={{ marginTop: 0, marginBottom: 0 }}
                                key="2"
                                disabled
                            >
                                <Link to="/admin/offers">
                                    <FontAwesomeIcon
                                        className="text-white"
                                        icon={faDollarSign}
                                    />
                                    {
                                        collapsed ? null : " Offers"
                                    }
                                </Link>
                            </Menu.Item>
                            <Menu.Item
                                className="bg-green-500 text-center text-white bg-green-800-selected"
                                style={{ marginTop: 0, marginBottom: 0 }}
                                key="3"
                                disabled
                            >
                                <Link to="/admin/offers">
                                    <FontAwesomeIcon
                                        className="text-white"
                                        icon={faHandHoldingUsd}
                                    />
                                    {
                                        collapsed ? null : " Local offers"
                                    }
                                </Link>
                            </Menu.Item>
                            <Menu.Item
                                className="bg-green-500 text-center text-white bg-green-800-selected"
                                style={{ marginTop: 0, marginBottom: 0 }}
                                key="4"
                                disabled
                            >
                                <Link to="/admin/offers">
                                    <FontAwesomeIcon
                                        className="text-white"
                                        icon={faRoute}
                                    />
                                    {
                                        collapsed ? null : " Pathways"
                                    }
                                </Link>
                            </Menu.Item>
                            <Menu.Item
                                className="bg-green-500 text-center text-white bg-green-800-selected"
                                style={{ marginTop: 0, marginBottom: 0 }}
                                key="5"
                            >
                                <Link to="/admin/settings">
                                    <FontAwesomeIcon
                                        className="text-white"
                                        icon={faCog}
                                    />
                                    {
                                        collapsed ? null : " Settings"
                                    }
                                </Link>
                            </Menu.Item>
                            <Menu.Item
                                className="bg-green-500 text-center text-white bg-green-800-selected"
                                style={{ marginTop: 0, marginBottom: 0 }}
                                key="6"
                                disabled
                            >
                                <Link to="/admin/database">
                                    <FontAwesomeIcon
                                        className="text-white"
                                        icon={faDatabase}
                                    />
                                    {
                                        collapsed ? null : " Database"
                                    }
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
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
                                                PROVIDERS
                                            </Button>
                                        </Row>
                                    )}
                                />
                            </Col>
                            <Col span={12} className="flex justify-end">
                                <Button type="link">
                                    <Link to="/">
                                        <i className="fas fa-sign-out-alt text-black"></i>
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
                        </Content>
                    </Col>
                </Layout>
                <Modal
                    title="Generic Forms Modal"
                    visible={this.state.isModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                          Create
                        </Button>,
                        <Button key="back" onClick={this.handleCancel}>
                          Close
                        </Button>,
                    ]}
                >
                    <p>Provider content</p>
                </Modal>
            </>
        );
    }
}

export default AdminDashboardPage;
