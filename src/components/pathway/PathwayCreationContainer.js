import React, { useEffect } from 'react';
import { Button, Form, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import PathwayForm from 'components/pathway/PathwayForm';
import OfferStore from 'store/Offer';
import DataFieldStore from 'store/DataField';
import PathwayStore from 'store/Pathway';
import dayjs from 'dayjs';

configure({
    axios: axiosInstance,
})

const PathwayCreationContainer = (({ className, closeModal }) => {
    const [ form ] = Form.useForm();
    const pathwayStore = PathwayStore.useContainer();

    const [{
        data: getDataFields,
        error: getDataFieldsError,
    }] = useAxios('/datafields');
    
    const [{ data: postData, error: postError, response }, executePost ] = useAxios({
        url: '/pathways',
        method: 'POST'
    }, { manual: true });

    const offerStore = OfferStore.useContainer();
    const datafieldStore = DataFieldStore.useContainer();

    const submit = async () => {
        const values = form.getFieldsValue([
            'description', 'learn_and_earn', 'frequency',
            'frequency_unit', 'credit_unit', 'pay_unit',
            'length', 'length_unit', 'name', 'start_date',
            'topics', 'pay', 'credit', 'outlook', 'earnings',
            'type'
        ]);

        const {
            description, learn_and_earn, credit, credit_unit,
            pay, pay_unit, length, length_unit, name, start_date, type,
        } = values;

        if (
            description && learn_and_earn && credit && 
            credit_unit && pay && pay_unit && length && length_unit && name
            && type
        ) {
            const response = await executePost({
                data: {
                    ...values,
                    start_date: dayjs(start_date).toISOString() || null
                }
            });

            if (response && response.status === 201) {
                form.resetFields();
                closeModal();
            }
        }
    }

    useEffect(() => {
        if (getDataFields) {
            datafieldStore.addMany(getDataFields);
        }
        if (postError) {
            const { status, statusText } = postError.request;
            notification.error({
                message: status,
                description: statusText,
            })
        }
        if (postData) {
            pathwayStore.addOne(postData);
        }
    }, [getDataFields])

    return (
        <div>
            <Form form={form} name="offerForm">
                <div
                    className="p-6 overflow-y-auto"
                    style={{ maxHeight: "32rem" }}
                >
                    <PathwayForm
                        datafields={datafieldStore.entities}
                    />
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
                        htmlType="submit"
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

export default PathwayCreationContainer;
