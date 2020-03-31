import React, { useEffect } from 'react';
import ProviderForm from 'components/provider/ProviderForm';
import { Table, Button, Form } from 'antd';
import TypeStore from 'store/Type';
import { configure } from 'axios-hooks';
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

const ProviderCreationContainer = (({ className, closeModal }, ref) => {
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

    
    const submit = async () => {
        const values = form.getFieldsValue([
            "name",
            "location",
            "type",
            "learn_and_earn",
            "is_public",
            "industry",
            "description",
            "industry",
            "financial_aid",
            "credit",
            "news",
            "contact",
            "pay",
            "cost",
            "topics"
        ]);

        const { name, location, type, learn_and_earn, is_public } = values;

        if (
            name && location && type && learn_and_earn && is_public
        ) {
            const response = await axiosInstance.post('/providers', {
                ...values,
                topics: JSON.stringify(values.topics),
            });
            console.log(response);
        }
        // console.log(response);
    }

    return (
        <div>
            <Form form={form}>
                <div className="p-6">
                    <ProviderForm
                        types={types}
                        topics={topics}
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
                <section
                    className="bg-white px-6 pt-6 flex justify-center"
                    style={{
                        borderTop: "1px solid #f0f0f0"
                    }}
                >
                    <Button
                        className="mr-3 px-20"
                        type="primary"
                        htmlType="submit"
                        onClick={submit}
                    >
                        Create
                    </Button>
                    <Button
                        className="px-20"
                        type="dashed"
                        onClick={() => closeModal()}
                    >
                        Close
                    </Button>
                </section>
            </Form>
        </div>
    );
})

export default ProviderCreationContainer;
