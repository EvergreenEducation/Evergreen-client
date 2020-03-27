import React from 'react';
import { Card, Table, Tag } from 'antd';

const columns = [
    {
        title: 'Name / ID',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Provider',
        dataIndex: 'provider',
        key: 'provider',
    },
    {
        title: 'Topics',
        dataIndex: 'topics',
        key: 'topics',
        render: tags => {
            return (
                <span>
                    {
                        tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                            return (
                                <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                                </Tag>
                            );
                        })
                    }
                </span>
            );
        }
    },
    {
        title: 'Start Date',
        dataIndex: 'start_date',
        key: 'start_date',
    },
];

const data = [
    {
        key: '1',
        name: 'Maths differential equations solving curse [156625906]',
        category: 'Web Development',
        provider: 'Unicore Technology Vision',
        topics: ['Education', 'Computer Science'],
        start_date: '2020-02-18',
    }
];

function OffersScreen() {
    return (
        <>
            <Card className="h-full rounded-md shadow">
                <Table
                    columns={columns}
                    dataSource={data}
                />
            </Card>
        </>
    );
}

export default OffersScreen;