import React from 'react';
import { Card, Table, Tag } from 'antd';

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
        dataIndex: 'topics',
        key: 'topics',
        render: tags => {
            console.log(tags);
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
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
    },
];

const data = [
    {
        key: '1',
        name: 'Biological Advance South',
        location: 'Switzerland',
        industry: 'Biotech',
        topics: ['Education', 'Computer Science'],
        type: 'International',
    }
];

function ProvidersScreen() {
    return (
        <>
            <Card className="h-full rounded-md">
                <Table
                    columns={columns}
                    dataSource={data}
                />
            </Card>
        </>
    );
}

export default ProvidersScreen;
