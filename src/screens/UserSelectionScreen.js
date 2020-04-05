import React from 'react';
import { Layout, Row, Col, Card, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChalkboardTeacher, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import 'scss/screens/user-selection-screen.scss';

const { Content } = Layout;

export default function UserSelectionScreen() {
    return (
        <Layout className="h-full bg-gray-100">
            <div className="w-full bg-gray-100">
                <Content className="mx-auto max-w-4xl h-full bg-gray-100 flex items-center flex-col justify-center selection">
                    <span className="text-2xl mt-12 mb-6 question">
                        Are you are a . . .
                    </span>
                    <Row className="w-full justify-around user-selection-row">
                        <Col className="flex justify-center">
                            <Button
                                className="h-full"
                                type="link"
                            >
                                <Card
                                    className="w-72 h-88 rounded user-card flex justify-center flex-col border-none"
                                    cover={
                                        <FontAwesomeIcon
                                            className="mx-auto bordered text-blue-600 user-card__icon"
                                            style={{ fontSize: "8rem", color: "rgb(57, 107, 86)" }}
                                            icon={faUserGraduate}
                                        />
                                    }
                                >
                                    <span
                                        className="text-xl"
                                        style={{ color: "rgb(57, 107, 86)" }}
                                    >
                                        Student
                                    </span>
                                </Card>
                            </Button>
                        </Col>
                        <span className="my-auto text-center text-2xl">
                            OR
                        </span>
                        <Col className="flex justify-center">
                            <Button
                                className="h-full"
                                type="link"
                            >
                                <Card
                                    className="w-72 h-88 rounded user-card flex justify-center flex-col border-none"
                                    cover={
                                        <FontAwesomeIcon
                                            className="mx-auto bordered user-card__icon"
                                            style={{ fontSize: "8rem", color: "rgb(57, 107, 86)" }}
                                            icon={faChalkboardTeacher}
                                        />
                                    }
                                >
                                    <span
                                        className="text-xl"
                                        style={{ color: "rgb(57, 107, 86)" }}
                                    >
                                        Provider
                                    </span>
                                </Card>
                            </Button>
                        </Col>
                    </Row>
                </Content>
            </div>
        </Layout>
    );
}