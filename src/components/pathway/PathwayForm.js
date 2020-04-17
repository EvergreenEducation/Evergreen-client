import React, { useState, useEffect } from 'react';
import {
    Layout, Form, Input, Row,
    Col, Select, Button, DatePicker,
    Table, Popconfirm
} from 'antd';
import TitleDivider from 'components/TitleDivider';
import { ImageUploadAndNameInputs } from 'components/shared';
import { groupBy, property, isNil, snakeCase, head } from 'lodash';
import 'scss/antd-overrides.scss';
import OfferGroupTable from './OfferGroupTable';

const { Option } = Select;
const { Column } = Table;

const preloadOptions = (data = []) => data.map((item, index) => {
    return (
        <Option
            value={item.id}
            key={index.toString()}
        >
            {item.name}
        </Option>
    );
});

const PathwayForm = (props) => {
    let {
        datafields = [], offers = [],
        groupsOfOffers = [], setGroupsOfOffers,
        userId = null, file, onChangeUpload,
        pathway, handleGroupRemoval,
        providers, scopedToProvider = false,
    } = props;
    const [ groupNameString, setGroupNameString ] = useState('');
    datafields = Object.values(datafields);

    const handleGroupName = (e) => {
        return setGroupNameString(e.target.value);
    }

    useEffect(() => {}, [file, pathway, groupsOfOffers]);

    const doesGroupNameExist = (groups) => {
        groups.some(group => {
            return (group.name === groupNameString)
                || (group.inputName === snakeCase(groupNameString.toLowerCase()));
        });
    };

    const addGroupName = () => {
        if (!groupNameString.length) {
            return;
        }

        if (doesGroupNameExist(groupsOfOffers)) {
            return;
        }

        const inputName = snakeCase(groupNameString.toLowerCase());

        const newGroupsOfOffers = [
            ...groupsOfOffers,
            {
                group_name: groupNameString,
                inputName,
            }
        ];

        setGroupsOfOffers(newGroupsOfOffers);
    }

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

    let offerOptions = null;

    if (!isNil(offers) && offers.length) {
        offerOptions = preloadOptions(offers);
    }

    let providerOptions = null;

    if (!isNil(providers) && providers.length) {
        providerOptions = preloadOptions(providers);
    }

    const onCancel = e => {};

    return (
        <Layout>
            <ImageUploadAndNameInputs
                className="mb-2"
                userId={userId}
                onChangeUpload={onChangeUpload}
                file={file}
            >
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
                                className="w-full custom-datepicker rounded"
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
                <OfferGroupTable pathway={pathway}/>
                <div
                    className="w-full mb-4"
                    style={{
                        backgroundColor: '#e2e8f0',
                        height: '1px',
                    }}
                />
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
                        className="w-full custom-select"
                        mode="multiple"
                    >
                        {topicOptions}
                    </Select>
                </Form.Item>
            </Row>
            <Row gutter={8}>
                <Col
                    xs={24}
                    sm={24}
                    md={6}
                >
                    <Form.Item
                        label="Learn/Earn"
                        name="learn_and_earn"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please select an option" }]}
                    >
                        <Select className="rounded custom-select">
                            <Option value="learn">Learn</Option>
                            <Option value="earn">Earn</Option>
                            <Option value="both">Learn and Earn</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={6}
                >
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
                <Col
                    xs={24}
                    sm={24}
                    md={12}
                >
                    <Form.Item
                        label="Earnings"
                        name="earnings"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                    >
                        <Input className="rounded" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col
                    xs={24}
                    sm={24}
                    md={6}
                >
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
                <Col
                    xs={24}
                    sm={24}
                    md={6}
                >
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
                <Col
                    xs={24}
                    sm={24}
                    md={6}
                >
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
                <Col
                    xs={24}
                    sm={24}
                    md={6}
                >
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
                <Col
                    xs={24}
                    sm={24}
                    md={6}
                >
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
                <Col
                    xs={24}
                    sm={24}
                    md={6}
                >
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
                <Col
                    xs={24}
                    sm={24}
                    md={6}
                >
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
                <Col
                    xs={24}
                    sm={24}
                    md={6}
                >
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
            <Row gutter={8}>
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
                <Col span={12}>
                    <Form.Item
                        label="Provider"
                        name="provider_id"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit flex-col w-full"
                    >
                        <Select
                            className={`custom-select-rounded-l-r-none`}
                            showSearch
                            defaultValue={
                                scopedToProvider && providers && providers.length
                                    ? head(providers).id
                                    : null
                            }
                            name="provider_id"
                        >
                            {providerOptions}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Layout>
    );
};

export default PathwayForm;
