import React from 'react';
import { Layout, Tabs, Button, Row, Col, Input } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;

function PlaceholderFields() {
    return (
        <>
            <Col
                className="w-full mx-auto"
                style={{ padding: "0 25px" }}
                span={20}
            >
                <Input
                    type="text"
                    placeholder="USERNAME"
                    className="mb-1 p-3 w-full"
                />
                <Input.Password
                    className="p-3 w-full"
                    placeholder="PASSWORD"
                />
            </Col>
        </>
    );
}

function callback(key) {
    console.log(key);
}

function LoginRegisterPage() {
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-green-500">
            <main className="w-72 h-auto shadow-xl p-0">
                <Layout className="h-full w-72 bg-gray-100">
                    <Header className="bg-gray-100">
                        <Tabs
                            defaultActiveKey="2"
                            onChange={callback}
                        >
                            <TabPane tab="Student" key="1" />
                            <TabPane tab="Admin" key="2" />
                        </Tabs>
                    </Header>
                    <Content>
                        <PlaceholderFields />
                    </Content>
                    <Footer className="bg-gray-100">
                        <Col>
                            <Row className="mb-1">
                                <Col span={6}>
                                    <Button
                                        type="primary"
                                        className="bg-gray-500 border-gray-500"
                                    >
                                        <Link to="/">
                                            <FontAwesomeIcon
                                                className="text-white"
                                                icon={faArrowLeft}
                                            />
                                        </Link>
                                    </Button>
                                </Col>
                                <Col span={18}>
                                    <Button type="primary" className="w-full">
                                        <Link to="/admin">
                                            Login
                                        </Link>
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="justify-center">
                                <Link
                                    to="/"
                                    disabled
                                >
                                    Can't sign in?
                                </Link>
                            </Row>
                            <Row className="justify-center">
                                <Link
                                    to="/"
                                    disabled>
                                    Create account
                                </Link>
                            </Row>
                        </Col>
                    </Footer>
                </Layout>
            </main>
        </div>
    );
}

export default LoginRegisterPage;