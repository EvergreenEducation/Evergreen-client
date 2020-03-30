import React, { useEffect } from 'react';
import ProviderForm from 'components/provider/ProviderForm';
import { Table, Button, Form } from 'antd';
import TypeStore from 'store/Type';
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

const ProviderCreationContainer = React.forwardRef((props, ref) => {
    const [ form ] = Form.useForm();    
    const store = TypeStore.useContainer();
    const { entities } = store;

    const data = [];

    useEffect(() => {
        async function fetchTopicsProviderTypes() {
            try {
                const response = await axiosInstance.get('/datafields?type=topic&type=provider')
                store.addMany(response.data);
            } catch(e) {
                console.error(e);
            }
        }
        if (!Object.keys(entities).length) {
            fetchTopicsProviderTypes();
        }
    }, [data]);

    const types = Object.values(entities).filter(({ type }) => type === 'provider');
    const topics = Object.values(entities).filter(({ type }) => type === 'topic');

    return (
        <div>
            <ProviderForm
                types={types}
                topics={topics}
                form={form}
                ref={ref}
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
        </div>
    );
})

export default ProviderCreationContainer;
