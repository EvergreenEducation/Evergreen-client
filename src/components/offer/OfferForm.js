import React from 'react';
import { Layout, Form, Input, Row, Col, Select, AutoComplete, Button, DatePicker } from 'antd';
import { SearchFunnel, ImageUploadAndNameInputs } from 'components/shared';

const { Option } = Select;

const OfferForm = React.forwardRef((props, ref) => {
    const [ form ] = Form.useForm();

    return (
        <Layout>
            <Form
                form={form}
            >
                <ImageUploadAndNameInputs>
                    <Row gutter={8}>
                        <Col span={18}>
                            <Form.Item
                                label="Provider"
                                name="provider"
                                labelAlign={"left"}
                                colon={false}
                                className="mb-0 inherit"
                            >
                                <Row>
                                    <Col span={17}>
                                        <AutoComplete />
                                    </Col>
                                    <Col type={5}>
                                        <Button type="primary">
                                                Use Image
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Generic Offer"
                                name="generic_offer"
                                labelAlign={"left"}
                                colon={false}
                                className="mb-0 inherit"
                            >
                                <Select>
                                    <Option value="save_the_planet">Save the Planet</Option>
                                    <Option value="web_development">Web Development</Option>
                                    <Option value="science_offers">Science Offers</Option>
                                    <Option value="finance_and_business">Finance &#38; Business</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
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
                <Form.Item
                    label="Description"
                    name="description"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <SearchFunnel
                    title={"Related Offers"}
                />
                <SearchFunnel
                    title={"Pre-requisites"}
                />
                <SearchFunnel
                    title={"Topics"}
                />
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
                            label="Day &#38; Time"
                            name="datetime"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Select>
                                <Option value="morning">Morning</Option>
                                <Option value="afternoon">Afternoon</Option>
                                <Option value="evening">Evening</Option>
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
                            label="Cost"
                            name="cost"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Cost Unit"
                            name="cost_unit"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
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
                </Row>
                <Row gutter={8}>
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
                </Row>
            </Form>
        </Layout>
    );
});

export default OfferForm;