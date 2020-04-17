import React from 'react';
import { Layout, Form, Input, Row, Col } from 'antd';
import { ImageUploadAndNameInputs } from 'components/shared';
import 'scss/antd-overrides.scss';

const ProviderSimpleForm = (props) => {
    const {
        userId = null, onChangeUpload,
        file
    } = props;

    return (
        <Layout>
            <ImageUploadAndNameInputs
                className="mb-2"
                userId={userId}
                onChangeUpload={onChangeUpload}
                file={file}
            >
                <Row gutter={8}>
                    <Col
                        xs={12}
                        sm={12}
                        md={12}
                    >
                        <Form.Item
                            label="Location"
                            name="location"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                            rules={[{ required: true, message: "Please enter a location" }]}
                        >
                            <Input
                                name="location"
                                className="rounded"
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={12}
                        sm={12}
                        md={12}
                    >
                        <Form.Item
                            label="Industry"
                            name="industry"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input
                                name="industry"
                                className="rounded"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={24}>
                      <Form.Item
                          label="Description"
                          name="description"
                          labelAlign={"left"}
                          colon={false}
                          className="mb-0 inherit"
                      >
                          <Input className="rounded" />
                      </Form.Item>
                  </Col>
                </Row>
            </ImageUploadAndNameInputs>
        </Layout>
    );
}

export default ProviderSimpleForm;
