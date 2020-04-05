import React from 'react';
import { Layout, Form, Input, Row, Col, Select, Button, DatePicker } from 'antd';
import TitleDivider from 'components/TitleDivider';
import { ImageUploadAndNameInputs } from 'components/shared';
import { groupBy, property, isNil } from 'lodash';
import 'scss/antd-overrides.scss';

const { Option } = Select;

const PathwayForm = (props) => {
    let { datafields = [] } = props;
    datafields = Object.values(datafields);

    const grouped = groupBy(datafields, property('type'));

    const {
        payment_unit = [], length_unit = [], credit_unit = [],
        topic = [], frequency_unit = [],
    } = grouped;

    let topicOptions = null;

    if (!isNil(topic) && topic.length) {
        topicOptions = topic.map(({ name, id }, index) => (
            <Option
                value={id}
                key={index.toString()}
            >
                {name}
            </Option>
        ));
    }

    return (
        <Layout>
            <ImageUploadAndNameInputs>
                <Form.Item
                    label="Description"
                    name="description"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                    rules={[{ required: true, message: "Please fill in this field" }]}
                >
                    <Input.TextArea
                        className="rounded"
                        rows={2}
                    />
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
                            <Input className="rounded" />
                        </Form.Item>
                    </Col>
                </Row>
            </ImageUploadAndNameInputs>
            <TitleDivider title={"Add Offers Group"} />
            <Row>
                <Col span={8}>
                    <Input
                        className="w-full rounded-l rounded-r-none"
                        placeholder="Group Name"
                    />
                </Col>
                <Col type={4}>
                    <Button
                        className="rounded-l-none"
                        type="primary"
                    >
                        Add Group
                    </Button>
                </Col>
            </Row>
            <TitleDivider title={"Pathway Offers Groups"} />
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
                        className="w-full custom-select"
                        mode="multiple"
                    >
                        {topicOptions}
                    </Select>
                </Form.Item>
            </Row>
            <Row gutter={8}>
                <Col span={6}>
                    <Form.Item
                        label="Learn/Earn"
                        name="learn_and_earn"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please select an option" }]}
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
                        rules={[{ required: true, message: "Please fill in this field" }]}
                    >
                        <Input className="rounded" />
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
                        <Input className="rouned" />
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
                        rules={[{ required: true, message: "Please fill in this field" }]}
                    >
                        <Input
                            type="number"
                            className="rounded"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Length Unit"
                        name="length_unit"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please select an option" }]}
                    >
                        <Select className="rounded custom-select">
                            {
                                length_unit.map((l, index) => {
                                    return (
                                        <Option
                                            key={index.toString()}
                                            value={l.name}
                                        >
                                            {l.name}
                                        </Option>
                                    );
                                })
                            }
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
                        <Input
                            type="number"
                            className="rounded"
                        />
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
                        <Select className="rounded custom-select">
                            {
                                frequency_unit.map((f, index) => {
                                    return (
                                        <Option
                                            key={index.toString()}
                                            value={f.name}
                                        >
                                            {f.name}
                                        </Option>
                                    );
                                })
                            }
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
                        rules={[{ required: true, message: "Please fill in this field" }]}
                    >
                        <Input
                            type="number"
                            className="rounded"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Credit Unit"
                        name="credit_unit"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please select an option" }]}
                    >
                        <Select className="rounded custom-select">
                            {
                                credit_unit.map((credit, index) => {
                                    return (
                                        <Option
                                            key={index.toString()}
                                            value={credit.name}
                                        >
                                            {credit.name}
                                        </Option>
                                    );
                                })
                            }
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
                        rules={[{ required: true, message: "Please fill in this field" }]}
                    >
                        <Input
                            type="number"
                            className="rounded"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Pay Unit"
                        name="pay_unit"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please select an option" }]}
                    >
                        <Select className="rounded custom-select">
                            {
                                payment_unit.map((unit, index) => {
                                    return (
                                        <Option
                                            key={index.toString()}
                                            value={unit.name}
                                        >
                                            {unit.name}
                                        </Option>
                                    );
                                })
                            }
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
                    <Input className="rounded" />
                </Form.Item>
            </Col>
        </Layout>
    );
};

export default PathwayForm;