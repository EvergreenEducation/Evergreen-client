import React, { useState } from 'react';
import { Table, Tag, Card, Button, Skeleton } from 'antd';
import { imported } from 'react-imported-component/macro';

const ProviderUpdateModal = imported(() => import('components/provider/ProviderUpdateModal'), {
    LoadingComponent: () => (<Skeleton className="p-6" paragraph={{ rows: 15 }} active/>),
});

function ProvidersTable({ data = [], topics, providerTypes, loading, store }) {
    console.log(data);
    const [ modalVisibility, setModalVisibility ] = useState(false);
    const [ selectedProvider, setSelectedProvider ] = useState({});
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
        {
            title: null,
            dataIndex: 'update',
            key: 'update',
            render: (text, record) => {
                return (
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectedProvider(record);
                            setModalVisibility(true);
                        }}
                    >
                        Update
                    </Button>
                );
            }
        },
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
            <ProviderUpdateModal
                provider={selectedProvider}
                visible={modalVisibility}
                topics={Object.values(topics)}
                types={Object.values(providerTypes)}
                onCancel={() => setModalVisibility(false)}
                store={store}
            />
        </Card>
    );
}

export default ProvidersTable;
