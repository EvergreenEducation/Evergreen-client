import React from 'react';
import { Table, Button, Form, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from 'services/AxiosInstance';
import ProviderTypeStore from 'store/ProviderType';

const columns = [
    {
        title: 'Cod',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Type Name',
        dataIndex: 'type_name',
        key: 'type_name',
    },
    {
        title: 'Type Description',
        dataIndex: 'type_description',
        key: 'type_description',
    },
    {
        title: 'add',
        dataIndex: 'add',
        key: 'add',
    }
];

function ProviderTypeTable({ data = [], loading }) {
    const [ form ] = Form.useForm();
    const store = ProviderTypeStore.useContainer();

    async function createProviderType(data) {
        const response = await axiosInstance.post('/provider_types', data);
        if (response.status === 201) {
            store.addOne(response.data);
        }
    }

    function submit() {
        const values = form.getFieldsValue(["type_name", "type_description"]);
        createProviderType(values);
    }

    async function deleteProviderType(rowData) {
        const { id } = rowData;
        const response = await axiosInstance.delete(`/provider_types/${id}`);
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
                    <Input
                        disabled
                    />
                </Form.Item>
            ),
            type_name: (
                <Form.Item
                    className="mb-0"
                    name="type_name"
                    rules={[{ required: true, message: "Please enter provider type name" }]}
                >
                    <Input name="type_name"/>
                </Form.Item>
            ),
            type_description: (
                <Form.Item className="mb-0" name="type_description">
                    <Input name="type_description"/>
                </Form.Item>
            ),
            add: (
                <Button
                    type="primary"
                    shape="circle"
                    size="middle"
                    onClick={submit}
                    htmlType="submit"
                >
                    <FontAwesomeIcon
                        className="text-xl"
                        icon={faPlus}
                    />
                </Button>
            )
        }
    );

    newData = newData.map((row, index) => {
        if (index === 0) {
            return row;
        }
        return {
            ...row,
            add: (
                <Button
                    type="primary"
                    shape="circle"
                    size="middle"
                    danger
                    onClick={() => deleteProviderType(row)}
                >
                    <FontAwesomeIcon
                        className="text-xl"
                        icon={faMinus}
                    />
                </Button>
            )
        };
    });

    return (
        <Form form={form}>
            <Table
                rowKey="id"
                loading={loading}
                showHeader={true}
                columns={columns}
                dataSource={newData}
            />
        </Form>
    );
}

export default ProviderTypeTable;
