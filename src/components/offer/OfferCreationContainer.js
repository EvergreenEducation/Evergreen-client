import React, { useEffect } from 'react';
import { Table, Button, Form } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import useProviderDataFieldStore from 'components/provider/useProviderDataFieldStore';
import OfferForm from 'components/offer/OfferForm';
import OfferStore from 'store/Offer';

configure({
    axios: axiosInstance,
})

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

const OfferCreationContainer = (({ className, closeModal }) => {
    const [ form ] = Form.useForm();
    const [{ data: postData, error: postError }, executePost ] = useAxios({
        url: '/offers',
        method: 'POST'
    }, { manual: true });

    const offerStore = OfferStore.useContainer();
    const store = useProviderDataFieldStore();
    const { datafield: datafieldStore, provider: providerStore } = store;

    const submit = async () => {
        const values = form.getFieldsValue([
            'category', 'description', 'learn_and_earn',
            'part_of_day', 'frequency_unit', 'cost', 'credit_unit',
            'pay_unit', 'length_unit', 'name', 'start_date', 'provider_id',
            // 'topics',
        ]);

        const {
            category, description, learn_and_earn,
            part_of_day, frequency_unit, cost, credit_unit,
            pay_unit, length_unit, name, start_date
        } = values;

        console.log(values);

        if (
            category && description && learn_and_earn &&
            part_of_day && frequency_unit && cost && credit_unit &&
            pay_unit && length_unit && name
        ) {
            executePost({
                data: {
                    ...values,
                    start_date: start_date.toISOString() || null
                }
            });
        }
    }

    useEffect(() => {
        if (postData) {
            offerStore.addOne(postData);
            form.resetFields();
            closeModal();
        }
        if (postError) {
            console.log(postError);
        }
    }, [postData])

    return (
        <div>
            <Form form={form} name="offerForm">
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
                        type="primary"
                        size="small"
                        // htmlType="submit"
                        onClick={submit}
                    >
                        Create
                    </Button>
                    <Button
                        className="px-10 rounded"
                        size="small"
                        type="dashed"
                        onClick={() => closeModal()}
                    >
                        Cancel
                    </Button>
                </section>
            </Form>
        </div>
    );
})

export default OfferCreationContainer;
