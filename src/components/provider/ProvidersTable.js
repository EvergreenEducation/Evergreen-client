import React from 'react';
import { Table, Tag, Button } from 'antd';
import { find, matchesProperty, isNil } from 'lodash';

function ProvidersTable({ data = [], loading, handleUpdateModal }) {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Industry',
            dataIndex: 'industry',
            key: 'industry',
        },
        {
            title: 'Topics',
            dataIndex: 'DataFields',
            key: 'DataFields',
            render: (datafields) => {
                return (
                    <>
                        {
                            datafields.map((datafield, index) => {
                                if (datafield.type !== 'topic') {
                                    return null;
                                }
                                return (
                                    <Tag
                                        color={index % 2 ? "blue" : "orange"}
                                        key={datafield.id}
                                    >
                                        { datafield.name }
                                    </Tag>
                                );
                            }) || null
                        }
                    </>
                );
            }
        },
        {
            title: 'Type',
            dataIndex: 'DataFields',
            key: 'DataFields',
            render: (datafields = []) => {
                const datafield = find(datafields, matchesProperty('type', 'provider'));
                if (isNil(datafield)) {
                    return null;
                }
                return datafield.name;
            }
        },
        {
            title: null,
            dataIndex: 'update',
            key: 'update',
            render: (text, record) => {
                return (
                    <Button
                        type="link"
                        onClick={() => handleUpdateModal(record)}
                    >
                        Update
                    </Button>
                );
            }
        },
    ];

    return (
        <Table
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            columns={columns}
            dataSource={data}
        />
    );
}

export default ProvidersTable;
