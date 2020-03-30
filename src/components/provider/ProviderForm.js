import React, { useState } from 'react';
import { Layout, Form, Input, Row, Col, Select, AutoComplete, Tag } from 'antd';
import { SearchFunnel, ImageUploadAndNameInputs } from 'components/shared';

const { Search } = Input;


const { Option } = Select;

const ProviderForm = React.forwardRef((props, ref) => {
    const { types, topics = [], form } = props;
    const [ funnel, setFunnel ] = useState([]);
    
    const options = topics.map((item, index) => ({
        ...item,
        label: item.name,
        value: item.name,
        key: item.id + item.name + index
    }));

    const onSelect = (item) => {
        console.log(item);
        setFunnel([ ...funnel, item ]);
    }

    const handleClose = (index) => {
        const newFunnel = funnel.slice();
        newFunnel.splice(index, 1);
        setFunnel(newFunnel)
    }

    return (
        <Layout>
            <Form form={form} ref={ref}>
                <ImageUploadAndNameInputs>
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
                                <Select>
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
                                <Select>
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
                                <Select>
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
                <Form.Item
                    label="Description"
                    name="description"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Keywords"
                    name="keywords"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
                <SearchFunnel
                    form={form}
                    title={"Related Provider Images"}
                />
                <SearchFunnel
                    title={"Topics"}
                    data={topics}
                />
                {/* <section>
                    <Row className="mb-2 items-center mt-2">
                        <span
                            className="mr-2 text-gray-700 relative"
                            style={{ bottom: 2 }}
                        >
                            Topics
                        </span>
                        <Form.Item name="topics">
                            <AutoComplete
                                options={options}
                                className="custom-search"
                                onSelect={onSelect}
                            >
                                <Search
                                    onSearch={value => console.log(value)}
                                    enterButton
                                />
                            </AutoComplete>
                        </Form.Item>
                    </Row>
                    <div
                        className="rounded-sm h-32 bg-white p-2"
                        style={{
                            borderWidth: 1,
                            borderColor: "#d9d9d9"
                        }}
                    >
                        {
                            funnel.map((item, index)=> {
                                if (index % 2) {
                                    return (
                                        <Tag
                                            closable={true}
                                            color="green"
                                            className="mb-1"
                                            onClose={() => handleClose(index)}
                                            key={item + index}
                                        >
                                            {item}
                                        </Tag>
                                    );
                                }
                                return (
                                    <Tag
                                        closable={true}
                                        color="cyan"
                                        className="mb-1"
                                        onClose={() => handleClose(index)}
                                    >
                                        {item}
                                    </Tag>
                                );
                            })
                        }
                    </div>
                </section> */}
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
                <Form.Item
                    label="News"
                    name="news"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Contact"
                    name="contact"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Layout>
    );
});

export default ProviderForm;