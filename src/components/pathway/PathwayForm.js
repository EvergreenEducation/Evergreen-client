import React from 'react';
import { Layout, Form, Input, Row, Col, Select, Button, DatePicker } from 'antd';
import TitleDivider from 'components/TitleDivider';
import { ImageUploadAndNameInputs } from 'components/shared';

const { Option } = Select;

const PathwayForm = React.forwardRef((props, ref) => {
    const [ form ] = Form.useForm();

    return (
        <Layout>
            <Form
                form={form}
            >
                <ImageUploadAndNameInputs>
                    <Form.Item
                        label="Description"
                        name="description"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Row gutter={8}>
                        <Col span={10}>
                            <Form.Item
                                label="Start Date"
                                name="start_date"
                                labelAlign={"left"}
                                colon={false}
                                className="mb-0 inherit"
                            >
                                <DatePicker
                                    className="w-full"
                                    placeholder=""
                                />
                            </Form.Item>
                        </Col>
                        <Col span={14}>
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
                    </Row>
                </ImageUploadAndNameInputs>
                <TitleDivider title={"Add Offers Group"} />
                <Row>
                    <Col span={8}>
                        <Input
                            className="w-full"
                            placeholder="Group Name"
                        />
                    </Col>
                    <Col type={4}>
                        <Button type="primary">
                            Add Group
                        </Button>
                    </Col>
                </Row>
                <TitleDivider title={"Pathway Offers Groups"} />
                <Row gutter={8}>
                    <Col span={6}>
                        <Form.Item
                            label="Learn/Earn"
                            name="learn_or_earn"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Select>
                                <Option value="learn">Learn</Option>
                                <Option value="earn">Earn</Option>
                                <Option value="both">Learn and Earn</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Generic Type"
                            name="type"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Earnings"
                            name="earnings"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                <Col span={6}>
                        <Form.Item
                            label="Length"
                            name="length"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Length Unit"
                            name="length_unit"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Select>
                                <Option value="weeks">Weeks</Option>
                                <Option value="biweek">Biweeks</Option>
                                <Option value="months">Months</Option>
                                <Option value="quarters">Quarters</Option>
                                <Option value="semesters">Semesters</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Frequency"
                            name="frequency"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Frequency Unit"
                            name="frequency_unit"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Select>
                                <Option value="hours_per_day">hrs/day</Option>
                                <Option value="hours_per_week">hrs/week</Option>
                                <Option value="days_per_month">days/m</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={6}>
                        <Form.Item
                            label="Credit"
                            name="credit"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Credit Unit"
                            name="credit_unit"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Select>
                                <Option value="weekly">Weekly</Option>
                                <Option value="biweekly">Biweekly</Option>
                                <Option value="monthly">Monthly</Option>
                                <Option value="every_quarter">Every Quarter</Option>
                                <Option value="biannual">Biannual</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Pay"
                            name="pay"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Pay Unit"
                            name="pay_unit"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Select>
                                <Option value="weekly">Weekly</Option>
                                <Option value="biweekly">Biweekly</Option>
                                <Option value="monthly">Monthly</Option>
                                <Option value="every_quarter">Every Quarter</Option>
                                <Option value="biannual">Biannual</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Col span={12}>
                    <Form.Item
                        label="Outlook"
                        name="outlook"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Form>
        </Layout>
    );
});

export default PathwayForm;