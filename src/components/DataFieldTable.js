import React from 'react';
import { Table, Button, Form, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from 'services/AxiosInstance';

export default function DataFieldTable({ data = [], store, loading, type = null, columns }) {
    const [ form ] = Form.useForm();

    async function createDataField(data) {
        if (!data.name) {
            return;
        }
        const response = await axiosInstance.post('/datafields', data);
        if (response.status === 201) {
            store.addOne(response.data);
        }
    }

    function submit() {
        const data = form.getFieldsValue(["name", "description"]);
        createDataField({
            ...data,
            type
        });
    }

    async function deleteDataField(rowData) {
        const { id } = rowData;
        const response = await axiosInstance.delete(`/datafields/${id}`);
        if (response.status === 200) {
            store.removeOneByIdKey(id);
        }
    }

    let newData = data.slice();
    newData.unshift(
        {
            renderInputs: true,
            id: (
                <Form.Item className="mb-0">
                    <Input className="rounded" disabled />
                </Form.Item>
            ),
            name: (
                <Form.Item
                    className="mb-0"
                    name="name"
                    rules={[{ required: true, message: "Please enter provider type name" }]}
                >
                    <Input className="rounded" name="name"/>
                </Form.Item>
            ),
            description: (
                <Form.Item
                    className="mb-0"
                    name="description"
                >
                    <Input className="rounded" name="description"/>
                </Form.Item>
            ),
            add: (
                <Button
                    className="flex justify-center"
                    type="primary"
                    shape="circle"
                    size="small"
                    onClick={() => submit()}
                    htmlType="submit"
                >
                    <FontAwesomeIcon
                        className="text-xs"
                        icon={faPlus}
                    />
                </Button>
            )
        }
    );

    const includeAddButton = (row, index) => {
        if (index === 0) {
            return row;
        }
        return {
            ...row,
            add: (
                <Button
                    className="flex justify-center"
                    type="primary"
                    shape="circle"
                    size="small"
                    danger
                    onClick={() => deleteDataField(row)}
                >
                    <FontAwesomeIcon
                        className="text-xs"
                        icon={faMinus}
                    />
                </Button>
            )
        };
    }

    newData = newData.map(includeAddButton);

    return (
        <Form form={form}>
            <Table
                loading={loading}
                rowKey="id"
                showHeader={true}
                columns={columns}
                dataSource={newData}
            />
        </Form>
    );
}
