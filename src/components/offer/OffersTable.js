import React from 'react';
import { Table, Button, Tag } from 'antd';
import dayjs from 'dayjs';

function OffersTable(props) {
    const { data, providers, datafields, handleUpdateModal } = props;
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: id => {
                if (!datafields[id]) {
                    return null;
                }
                return datafields[id].name;
            }
        },
        {
            title: 'Provider',
            dataIndex: 'provider_id',
            key: 'provider_id',
            render: id => {
                if (providers[id]) {
                    return providers[id].name;
                }
                return null;
            },
        },
        {
            title: 'Topics',
            dataIndex: 'DataFields',
            key: 'DataFields',
            render: (datafields, record) => {
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
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            render: date => {
                return dayjs(date).format('MMM DD, YYYY');
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
            columns={columns}
            dataSource={data}
        />
    );
}

export default OffersTable;