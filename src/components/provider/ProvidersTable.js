import React from 'react';
import { Table, Tag } from 'antd';

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
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
      />
    );
}

export default ProvidersTable;
