import React from 'react';
import { Table, Tag, Card, Button } from 'antd';

function ProvidersTable({ data = [], topics, providerTypes, loading }) {
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
            render: topicIds => {
                if (!topicIds) {
                    return null;
                }
                topicIds = JSON.parse(topicIds);
                return (
                    <>
                        {
                            topicIds.map((id, index) => {
                                if (topics[id]) {
                                    return (
                                        <Tag
                                            color={index % 2 ? "blue" : "orange"}
                                            key={id}
                                        >
                                            {topics[id].name}
                                        </Tag>
                                    );
                                }
                                return null;
                            })
                        }
                    </>
                );
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: id => {
                if (!id) {
                    return null;
                }
                if (providerTypes[id]) {
                    return providerTypes[id].name;
                }
                return null;
            }
        },
        // {
        //     title: 'Update',
        //     dataIndex: 'update',
        //     key: 'update',
        //     render: (text, record) => {
        //         console.log(text, record);
        //         return (
        //             <Button type="link">
        //                 Update
        //             </Button>
        //         );
        //     }
        // },
    ];

    return (
        <Card className="shadow-md rounded-md">
            <Table
                loading={loading}
                pagination={{ pageSize: 10 }}
                rowKey="id"
                columns={columns}
                dataSource={data}
            />
        </Card>
    );
}

export default ProvidersTable;
