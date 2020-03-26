import React from 'react';
import { Layout, Tabs, Button, Row, Col, Input } from 'antd';
import { Link } from 'react-router-dom';
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
                <Input
                    type="password"
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
            <main className="w-1/5 h-auto shadow-xl p-0">
                <Layout className="h-full w-full bg-gray-100">
                    <Header className="bg-gray-100">
                        <Tabs
                            defaultActiveKey="2"
                            onChange={callback}
                        >
                            <TabPane tab="Student" key="1" />
                            <TabPane tab="Provider" key="2" />
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
                                            <i className="fas fa-arrow-left"></i>
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
