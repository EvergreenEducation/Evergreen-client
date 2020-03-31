import React from 'react';
import { Layout, Form, Input, Row, Col, Select } from 'antd';
import { ImageUploadAndNameInputs } from 'components/shared';

const { Option } = Select;

const ProviderForm = (props) => {
    const { types, topics = [] } = props;

    return (
        <Layout>
            <ImageUploadAndNameInputs className="mb-2">
                <Row gutter={8}>
                    <Col span={18}>
                        <Form.Item
                            label="Location"
                            name="location"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                            rules={[{ required: true, message: "Please enter a location" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Type"
                            name="type"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                            rules={[{ required: true, message: "Please select a type" }]}
                        >
                            <Select name="type">
                                {
                                    types.map(({name}, index) => {
                                        return (
                                            <Option
                                                key={name + index}
                                                value={name}>
                                                {name}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            label="Learn/Earn"
                            name="learn_and_earn"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                            rules={[{ required: true, message: "Please select an option" }]}
                        >
                            <Select name="learn_and_earn">
                                <Option value="learn">Learn</Option>
                                <Option value="earn">Earn</Option>
                                <Option value="both">Learn and Earn</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Public/Private"
                            name="is_public"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                            rules={[{ required: true, message: "Please select an option" }]}
                        >
                            <Select name="is_public">
                                <Option value={true}>Public</Option>
                                <Option value={false}>Private</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Industry"
                            name="industry"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </ImageUploadAndNameInputs>
            <Col span={24}>
                <Form.Item
                    label="Description"
                    name="description"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item
                    label="Keywords"
                    name="keywords"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Row className="items-center mt-2 mb-0">
                <span
                    className="text-gray-700 relative"
                    style={{ bottom: 2 }}
                >
                    Related Provider Images
                </span>
                <Form.Item
                    name="Related Provider Images"
                    className="w-full"
                >
                    <Input />
                </Form.Item>
            </Row>
            <Row className="items-center mb-0">
                <span
                    className="text-gray-700 relative"
                    style={{ bottom: 2 }}
                >
                    Topics
                </span>
                <Form.Item
                    name="topics"
                    className="w-full"
                >
                    <Select
                        showSearch
                        className="w-full"
                        mode="multiple"
                    >
                        {
                            topics.map((topic, index) => (
                                <Option
                                    key={topic.name + index}
                                    value={topic.id}
                                >
                                    {topic.name}
                                </Option>
                            ))
                        }
                    </Select>
                </Form.Item>
            </Row>
            <Row gutter={8}>
                <Col span={12}>
                    <Form.Item
                        label="Financial Aid"
                        name="financial_aid"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item
                        label="Cost"
                        name="cost"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                    >
                        <Input type="number" />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item
                        label="Pay"
                        name="pay"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                    >
                        <Input type="number" />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item
                        label="Credit"
                        name="credit"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                    >
                        <Input type="number" />
                    </Form.Item>
                </Col>
            </Row>
            <Col span={24}>
                <Form.Item
                    label="News"
                    name="news"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item
                    label="Contact"
                    name="contact"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
            </Col>
        </Layout>
    );
}

export default ProviderForm;