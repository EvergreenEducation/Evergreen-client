import React from 'react';
import { Table, Tag, Card } from 'antd';

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
    // {
    //     title: 'Topics',
    //     dataIndex: 'topics',
    //     key: 'topics',
    //     render: tags => {
    //         return (
    //             <span>
    //                 {
    //                     tags.map(tag => {
    //                     let color = tag.length > 5 ? 'geekblue' : 'green';
    //                     if (tag === 'loser') {
    //                         color = 'volcano';
    //                     }
    //                         return (
    //                             <Tag color={color} key={tag}>
    //                             {tag.toUpperCase()}
    //                             </Tag>
    //                         );
    //                     })
    //                 }
    //             </span>
    //         );
    //     }
    // },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
    },
];

function ProvidersTable({ data = [] }) {
    return (
        <Card className="shadow-md rounded-md">
            <Table
                pagination={{ pageSize: 7 }}
                rowKey="id"
                columns={columns}
                dataSource={data}
            />
        </Card>
    );
}

export default ProvidersTable;
