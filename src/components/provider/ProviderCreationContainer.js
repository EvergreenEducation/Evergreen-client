import React, { useEffect } from 'react';
import ProviderForm from 'components/provider/ProviderForm';
import { Table } from 'antd';
import ProviderTypeStore from 'store/ProviderType';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';

configure({
    axios: axiosInstance,
})

const offerColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Offer Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Offer Description',
        dataIndex: 'description',
        key: 'description',
    }
];

const pathwayColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Pathways Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Pathways Description',
        dataIndex: 'description',
        key: 'description',
    }
];

function ProviderCreationContainer(props, refs)  {
    const uploadRef = React.createRef();
    const formRef = React.createRef();
    
    const store = ProviderTypeStore.useContainer();
    const { entities } = store;
    let types = Object.values(entities);

    return (
        <>
            <ProviderForm
                types={types}
                ref={{
                    formRef: formRef,
                    uploadRef: uploadRef
                }}
            />
            <section className="mt-2">
                <label className="mb-2 block">
                    Offers - Table
                </label>
                <Table
                    columns={offerColumns}
                    dataSource={[]}
                />
            </section>
            <section className="mt-2">
                <label className="mb-2 block">
                    Pathways -Table
                </label>
                <Table
                    columns={pathwayColumns}
                    dataSource={[]}
                />
            </section>
        </>
    );
}

export default ProviderCreationContainer;
