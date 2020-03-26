import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { Layout, Menu, Button, Col, Row, Input, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBars, faDollarSign, faHandHoldingUsd,
    faTree, faRoute, faCog, faDatabase,
    faPlusCircle, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
import 'scss/antd-overrides.scss';
import ProvidersScreen from 'screens/ProvidersScreen';
import ProviderForm from 'components/ProviderForm';
import Sidebar from 'components/Sidebar';

const { Content, Header } = Layout;
const { Search } = Input;

class AdminDashboardPage extends Component {
    constructor(props) {
        super(props);
        this.uploadRef = React.createRef();
        this.formRef = React.createRef();
    }

    state = {
        isModalVisible: false,
        formType: "providers"
    }

    openModal = () => {
        this.setState({
            isModalVisible: true
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

    getFormData = (results) => {
        const formData = this.formRef.current.getFieldsValue(["name"]);
        console.log(formData);

        const uploadData = this.uploadRef.current.state.file;
        console.log(uploadData);
    }

    componentDidMount() {
        this.props.history.push('/admin/providers');
    }

    render() {
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
                                                PROVIDERS
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
                    <Route
                        exact
                        path="/admin/providers"
                        render={() => (
                            <ProviderForm
                                ref={{
                                    formRef: this.formRef,
                                    uploadRef: this.uploadRef
                                }}
                            />
                        )}
                    />
                </Modal>
            </>
        );
    }
}

export default AdminDashboardPage;
