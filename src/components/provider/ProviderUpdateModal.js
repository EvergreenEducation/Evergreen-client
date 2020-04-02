import React, { useEffect } from 'react';
import { Modal, Form, Table, Button } from 'antd';
import ProviderForm from 'components/provider/ProviderForm';
import axiosInstance from 'services/AxiosInstance';
import { isNil, groupBy } from 'lodash';
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
    const [ form ] = Form.useForm();
    const formRef = React.createRef();
    const { provider, onCancel, visible, datafields } = props;

    const groupedDataFields = groupBy(provider.DataFields, 'type') || [];
    let providerType = null;
    if (groupedDataFields.provider && groupedDataFields.provider.length) {
        providerType = groupedDataFields.provider[0].id
    }

    let topics = [];

    if (!isNil(groupedDataFields.topic)) {
        topics = groupedDataFields.topic.reduce((acc, curr, index) => {
            if (isNil(acc)) {
                return [];
            }
            acc.push(curr.id);
            return acc;
        }, []);
    }

    const providerStore = ProviderStore.useContainer();
    
    function populateFields(p, ref) {
        ref.current.setFieldsValue({
            name: p.name,
            type: providerType,
            learn_and_earn: p.learn_and_earn,
            industry: p.industry,
            location: p.location,
            description: p.description,
            topics: topics,
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
    }, [props, form, provider]);

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
                    topics: values.topics,
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
            <Form form={form}>
                <div
                    className="p-6 overflow-y-auto"
                    style={{ maxHeight: "32rem" }}
                >
                    <ProviderForm
                        datafields={datafields}
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
                    className="bg-white px-6 pt-5 pb-1 flex justify-center"
                    style={{
                        borderTop: "1px solid #f0f0f0"
                    }}
                >
                    <Button
                        className="mr-3 px-10 rounded"
                        size="small"
                        type="primary"
                        htmlType="submit"
                        onClick={() => submitUpdate()}
                    >
                        Update
                    </Button>
                    <Button
                        className="px-10 rounded"
                        size="small"
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