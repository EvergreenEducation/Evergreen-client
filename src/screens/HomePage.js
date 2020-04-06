import React from 'react';
import { Layout, Row, Col, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import ProviderStore from 'store/Provider';
import DataFieldStore from 'store/DataField';

const { Header, Content } = Layout;

function HomePage() {
    return (
        <>
            <ProviderStore.Provider>
                <DataFieldStore.Provider>
                    <Layout className="h-full white">
                        <div className="w-full bg-white">
                            <Content className="mx-auto max-w-4xl h-screen bg-gray-100">
                            </Content>
                        </div>
                        <Header className="h-12 w-full bg-green-500 fixed bottom-0">
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
                                      <Button
                                          type="primary"
                                          shape="circle"
                                          onClick={() => {
                                            window.location.replace(`${process.env.REACT_APP_API_URL}/login`)
                                          }}
                                      >
                                          <FontAwesomeIcon
                                              className="text-white"
                                              icon={faSignInAlt}
                                          />
                                      </Button>
                                </Col>
                            </Row>
                        </Header>
                    </Layout>
                </DataFieldStore.Provider>
            </ProviderStore.Provider>
        </>
    );
}

export default HomePage;
