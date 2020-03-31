import React, { useState } from 'react';
import { Row, AutoComplete, Input, Tag, Form, Select } from 'antd';
import 'scss/antd-overrides.scss';
const { Search } = Input;
const { Option } = Select;

function SearchFunnel(props) {
    const [ funnel, setFunnel ] = useState([]);
    const { title, data = [] } = props;
    console.log(data);
    const options = data.map((item) => ({
        ...item,
        label: item.name,
        value: item.name,
        key: item.id + item.name
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

    console.log(data);

    return (
        <>
            <Row className="mb-2 items-center mt-2">
                <span
                    className="mr-2 text-gray-700 relative"
                    style={{ bottom: 2 }}
                >
                    {title}
                </span>
                <Form.Item name="topics" className="w-full">
                    <Select
                        className="w-full"
                        style={{ width: 100 }}
                        mode="multiple"
                        placeholder="Please select favourite colors"
                    >
                        {
                            data.map((topic) => (<Option value={topic.name}>{topic.name}</Option>))
                        }
                    </Select>
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
                    funnel.map((topic, index)=> {
                        if (index % 2) {
                            return (
                                <Tag
                                    closable={true}
                                    color="green"
                                    className="mb-1"
                                    onClose={() => handleClose(index)}
                                    key={topic + index}
                                >
                                    {topic}
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
                                {topic}
                            </Tag>
                        );
                    })
                }
            </div>
        </>
    );
}

export default SearchFunnel;
