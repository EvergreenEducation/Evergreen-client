import React, { useEffect } from 'react';
import { Modal, Form, Table, Button, } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import useProviderDataFieldStore from 'components/provider/useProviderDataFieldStore';
import OfferForm from 'components/offer/OfferForm';
import OfferStore from 'store/Offer';
import dayjs from 'dayjs';
import 'scss/antd-overrides.scss';

configure({
  axios: axiosInstance
});

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

export default function OfferUpdateModal(props) {
    const { offer, onCancel, visible } = props;
    const [ form ] = Form.useForm();
    const [{ data: putData, error: putError }, executePut ] = useAxios({
        url: '/offers',
        method: 'PUT'
    }, { manual: true });

    const offerStore = OfferStore.useContainer();
    const store = useProviderDataFieldStore();
    const { datafield: datafieldStore, provider: providerStore } = store;

    const submitUpdate = async () => {
        const values = form.getFieldsValue([
            'category', 'description', 'learn_and_earn',
            'part_of_day', 'frequency', 'frequency_unit', 'cost', 'credit_unit',
            'pay_unit', 'length_unit', 'name', 'start_date', 'provider_id',
            'topics', 'pay', 'credit'
        ]);

        const {
            category, description, learn_and_earn,
            part_of_day, frequency_unit, cost, credit, credit_unit,
            pay, pay_unit, length_unit, name, start_date, frequency
        } = values;

        if (
            category && description && learn_and_earn &&
            part_of_day && frequency_unit && cost && credit && 
            credit_unit && pay && pay_unit && length_unit && name
            && frequency
        ) {
            executePut({
                data: {
                    ...values,
                    start_date: start_date.toISOString() || null
                }
            });
        }
    }

    function populateFields(o, formInstance) {
        console.log(o);
        formInstance.setFieldsValue({
            category: o.category,
            description: o.description,
            learn_and_earn: o.learn_and_earn,
            part_of_day: o.part_of_day,
            frequency: o.frequency,
            frequency_unit: o.frequency_unit,
            cost: o.cost,
            credit: o.credit,
            credit_unit: o.credit_unit,
            pay: o.pay,
            pay_unit: o.pay_unit,
            length_unit: o.length_unit,
            name: o.name,
            // start_date: dayjs(o.start_date),
            provider_id: o.provider_id,
            topics: o.topics,
            // name: p.name,
            // type: providerType,
            // learn_and_earn: p.learn_and_earn,
            // industry: p.industry,
            // location: p.location,
            // description: p.description,
            // topics: topics,
            // cost: p.cost,
            // pay: p.pay,
            // credit: p.credit,
            // contact: p.contact,
            // is_public: p.is_public,
            // financial_aid: p.financial_aid,
        });
    }

    useEffect(() => {
        if (putData) {
            offerStore.addOne(putData);
            onCancel();
        }
        if (putError) {
            console.log(putError);
        }
        if (form) {
            populateFields(offer, form);
        }
        if (offer) {
            console.log(offer);
        }
    }, [putData, offer])

    return (
        <Modal
            forceRender={true}
            className="custom-modal"
            title={"Update Offer"}
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
                    <OfferForm
                        form={form}
                        datafields={datafieldStore.entities}
                        providers={providerStore.entities}
                    />
                    <section className="mt-2">
                        <label className="mb-2 block">
                            Pathways - Table
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