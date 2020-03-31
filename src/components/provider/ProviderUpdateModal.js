import React, { useEffect } from 'react';
import { Modal, Form, Table, Button } from 'antd';
import ProviderForm from 'components/provider/ProviderForm';
import axiosInstance from 'services/AxiosInstance';
import { isNil } from 'lodash';
import { configure } from 'axios-hooks';
import ProviderStore from 'store/Provider';
import 'scss/antd-overrides.scss';

configure({
  axios: axiosInstance
});

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

export default function ProviderUpdateModal(props) {
    const { provider, types, topics, onCancel, visible } = props;
    const [ form ] = Form.useForm();
    const formRef = React.createRef();

    const providerStore = ProviderStore.useContainer();
    
    let setTopics = [];

    if (provider.topics) {
        setTopics = JSON.parse(provider.topics);
    }
    
    function populateFields(p, ref) {    
        ref.current.setFieldsValue({
            name: p.name,
            type: p.type,
            learn_and_earn: p.learn_and_earn,
            industry: p.industry,
            location: p.location,
            description: p.description,
            topics: setTopics,
            cost: p.cost,
            pay: p.pay,
            credit: p.credit,
            contact: p.contact,
            is_public: p.is_public,
            financial_aid: p.financial_aid,
        });
    }

    useEffect(() => {
        formRef.current = form;
        if (formRef.current) {
            populateFields(provider, formRef);
        }
    }, [form, provider]);

    const submitUpdate = async () => {
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
            name && location && type && learn_and_earn && !isNil(is_public)
        ) {
            try {
                const response = await axiosInstance.put(`/providers/${provider.id}`, {
                    ...values,
                    topics: JSON.stringify(values.topics) || [],
                });

                if (response.status === 200) {
                    providerStore.updateOne(response.data);
                    onCancel();
                }
            } catch(e) {
                console.error(e);
            }
        }
    }

    return (
        <Modal
            forceRender={true}
            className="custom-modal"
            title={"Update Provider"}
            visible={visible}
            width={998}
            bodyStyle={{ backgroundColor: "#f0f2f5", padding: 0 }}
            footer={true}
            onCancel={onCancel}
        >
            <Form
                ref={formRef}
                form={form}
                name="updateProviderForm"
            >
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
                    className="bg-white px-6 pt-6 pb-1 flex justify-center"
                    style={{
                        borderTop: "1px solid #f0f0f0"
                    }}
                >
                    <Button
                        className="mr-3 px-20"
                        type="primary"
                        htmlType="submit"
                        onClick={() => submitUpdate()}
                    >
                        Update
                    </Button>
                    <Button
                        className="px-20"
                        type="dashed"
                        onClick={() => onCancel()}
                    >
                        Cancel
                    </Button>
                </section>
            </Form>
        </Modal>
    );
}