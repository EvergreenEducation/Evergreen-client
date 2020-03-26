import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Button } from 'antd';

const { Header, Content } = Layout;

function HomePage() {
    return (
        <>
            <Layout className="h-full white">
                <Header className="h-12 w-full bg-green-500">
                    <Row className="mx-auto max-w-4xl h-full">
                        <Col
                            className="flex justify-start items-center h-full"
                            span={12}
                        >
                        </Col>
                        <Col
                            className="flex justify-end items-center h-full"
                            span={12}
                        >
                            <Link to="/auth">
                                <Button
                                    type="primary"
                                    shape="circle"
                                >
                                    <i className="fas fa-sign-in-alt"></i>
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Header>
                <div className="w-full bg-white">
                    <Content className="mx-auto max-w-4xl h-screen bg-gray-100">
                    </Content>
                </div>
            </Layout>
        </>
    );
}

export default HomePage;
