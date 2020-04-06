import React, { useEffect } from 'react';
import { Modal, Form, Button, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import DataFieldStore from 'store/DataField';
import PathwayForm from 'components/pathway/PathwayForm';
import dayjs from 'dayjs';
import 'scss/antd-overrides.scss';
import moment from 'moment';
import { groupBy, isNil } from 'lodash';

configure({
  axios: axiosInstance
});

export default function PathwayUpdateModal(props) {
    const { pathway, onCancel, visible, pathwayStore } = props;
    const [ form ] = Form.useForm();
    const datafieldStore = DataFieldStore.useContainer();
    const [{ data: putData, error: putError, response }, executePut ] = useAxios({
        method: 'PUT'
    }, { manual: true });

    const submitUpdate = async () => {
        const values = form.getFieldsValue([
            'description', 'learn_and_earn', 'frequency',
            'frequency_unit', 'credit_unit', 'pay_unit',
            'length', 'length_unit', 'name', 'start_date',
            'topics', 'pay', 'credit', 'outlook', 'earnings',
            'type', 'keywords'
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
            const response = await executePut({
                url: `/pathways/${pathway.id}`,
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

    const groupedDataFields = groupBy(pathway.DataFields, 'type') || [];

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

    function populateFields(p, formInstance) {
        formInstance.setFieldsValue({
            name: p.name,
            description: p.description,
            learn_and_earn: p.learn_and_earn,
            frequency: p.frequency,
            frequency_unit: p.frequency_unit,
            credit: p.credit,
            credit_unit: p.credit_unit,
            pay: p.pay,
            pay_unit: p.pay_unit,
            length: p.length,
            length_unit: p.length_unit,
            start_date: moment(p.start_date),
            topics: myTopics,
            outlook: p.outlook,
            earnings: p.earnings,
            keywords: p.keywords,
            type: p.type
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
            populateFields(pathway, form);
        }
        if (response && response.status === 200) {
            pathwayStore.updateOne(putData);
        }
    }, [putData, pathway, putError, response])

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