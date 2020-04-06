import React, { useEffect } from 'react';
import { Modal, Form, Table, Button, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import useProviderDataFieldStore from 'components/provider/useProviderDataFieldStore';
import OfferForm from 'components/offer/OfferForm';
import dayjs from 'dayjs';
import 'scss/antd-overrides.scss';
import moment from 'moment';
import { groupBy, isNil } from 'lodash';

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
    const { offer, onCancel, visible, offerStore } = props;
    const [ form ] = Form.useForm();
    const [{ data: putData, error: putError, response }, executePut ] = useAxios({
        method: 'PUT'
    }, { manual: true });

    const store = useProviderDataFieldStore();
    const { datafield: datafieldStore, provider: providerStore } = store;

    const submitUpdate = async () => {
        const values = form.getFieldsValue([
            'category', 'description', 'learn_and_earn',
            'part_of_day', 'frequency', 'frequency_unit', 'cost', 'credit_unit',
            'pay_unit', 'length', 'length_unit', 'name', 'start_date', 'provider_id',
            'topics', 'pay', 'credit'
        ]);

        const {
            category, description, learn_and_earn,
            part_of_day, frequency_unit, cost, credit, credit_unit,
            pay, pay_unit, length, length_unit, name, start_date, frequency
        } = values;

        if (
            category && description && learn_and_earn &&
            part_of_day && frequency_unit && cost && credit && 
            credit_unit && pay && pay_unit && length && length_unit && name
            && frequency
        ) {
            const response = await executePut({
                url: `/offers/${offer.id}`,
                data: {
                    ...values,
                    start_date: dayjs(start_date).toISOString() || null,
                    updatedAt: new dayjs().toISOString()
                }
            });

            if (response && response.status === 200) {
                onCancel();
                notification.success({
                    message: response.status,
                    description: 'Successfully updated offer'
                })
            }
        }
    }

    const groupedDataFields = groupBy(offer.DataFields, 'type') || [];

    let offerCategory = null;
    if (groupedDataFields.offer_category && groupedDataFields.offer_category.length) {
        offerCategory = groupedDataFields.offer_category[0].id
    }

    let myTopics = [];

    if (!isNil(groupedDataFields.topic)) {
        myTopics = groupedDataFields.topic.reduce((acc, curr, index) => {
            if (isNil(acc)) {
                return [];
            }
            acc.push(curr.id);
            return acc;
        }, []);
    }

    function populateFields(o, formInstance) {
        formInstance.setFieldsValue({
            category: offerCategory,
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
            length: o.length,
            length_unit: o.length_unit,
            name: o.name,
            start_date: moment(o.start_date),
            provider_id: o.provider_id,
            topics: myTopics,
        });
    }

    useEffect(() => {
        if (putError) {
            const { status, statusText } = putError.request;
            notification.error({
                message: status,
                description: statusText,
            });
        }
        if (form) {
            populateFields(offer, form);
        }
        if (response && response.status === 200) {
            offerStore.updateOne(putData);
        }
    }, [putData, offer, putError, response])

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
                            rowKey="id"
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
                        onClick={submitUpdate}
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