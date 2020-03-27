import React from 'react';
import { Card, Table, Tag } from 'antd';

const columns = [
    {
        title: 'Name / ID',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Provider',
        dataIndex: 'provider',
        key: 'provider',
    },
    {
        title: 'Generic Type',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Offer Groups',
        dataIndex: 'groups',
        key: 'groups',
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
];

const data = [
    {
        key: '1',
        name: 'Heliophysics [161500697]',
        provider: 'Provider from Texas',
        type: "Astrophysics",
        groups: ['Sun Physics (2)', 'Solar Weather (1)'],
        topics: ["Physics", "Economics", "Biology", "Education"]
    }
];

function PathwaysTable() {
    return (
        <Card className="h-full rounded-md shadow">
            <Table
                columns={columns}
                dataSource={data}
            />
        </Card>
    );
}

export default PathwaysTable;