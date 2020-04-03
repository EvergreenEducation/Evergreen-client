import React from 'react';
import { Card, Table, Tag } from 'antd';
import dayjs from 'dayjs';

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
    },
    {
        title: 'Provider',
        dataIndex: 'provider_id',
        key: 'provider_id',
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
        title: 'Start Date',
        dataIndex: 'start_date',
        key: 'start_date',
        render: date => {
            // console.log(date);
            return dayjs(date).format('MMM DD, YYYY');
        }
    },
];

function OffersTable(props) {
    const { data } = props;
    return (
        <Table
            columns={columns}
            dataSource={data}
        />
    );
}

export default OffersTable;