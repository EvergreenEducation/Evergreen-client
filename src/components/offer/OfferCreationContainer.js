import React, { useEffect, useState } from 'react';
import { Table, Button, Form, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import useProviderDataFieldStore from 'components/provider/useProviderDataFieldStore';
import OfferForm from 'components/offer/OfferForm';
import OfferStore from 'store/Offer';
import dayjs from 'dayjs';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';

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
    const { id: userId } = AuthService.currentSession;
    const [file, setFile] = useState(null);
    const [ form ] = Form.useForm();
    const [{ data: postData, error: postError, response }, executePost ] = useAxios({
        url: '/offers',
        method: 'POST'
    }, { manual: true });

    const onChangeUpload = (e) => {
        const { file } = e;
        if (file) {
            setFile(file);
        }
    }

    const offerStore = OfferStore.useContainer();
    const store = useProviderDataFieldStore();
    const { datafield: datafieldStore, provider: providerStore } = store;

    const submit = async () => {
        const values = form.getFieldsValue([
            'category', 'description', 'learn_and_earn',
            'part_of_day', 'frequency', 'frequency_unit', 'cost', 'credit_unit',
            'pay_unit', 'length', 'length_unit', 'name', 'start_date', 'provider_id',
            'topics', 'pay', 'credit', 'related_offers', 'prerequisites', 'keywords'
        ]);

        const {
            category, description, learn_and_earn,
            part_of_day, frequency_unit, cost, credit, credit_unit,
            pay, pay_unit, length, length_unit, name, start_date, frequency,
        } = values;

        if (
            category && description && learn_and_earn &&
            part_of_day && frequency_unit && cost && credit && 
            credit_unit && pay && pay_unit && length && length_unit && name
            && frequency
        ) {
            const response = await executePost({
                data: {
                    ...values,
                    start_date: dayjs(start_date).toISOString() || null
                }
            });

            if (response.data && file && userId) {
                const { name, type } = file;
                const results = await UploaderService.upload({
                    name,
                    mime_type: type,
                    uploaded_by_user_id: userId,
                    fileable_type: 'offer',
                    fileable_id: response.data.id,
                    binaryFile: file.originFileObj,
                });

                if (results.success) {
                    notification.success({
                        message: 'Success',
                        description: 'Image is uploaded'
                    })
                }
            }

            if (response && response.status === 201) {
                form.resetFields();
                closeModal();
            }
        }
    }

    useEffect(() => {
        if (postData) {
            offerStore.addOne(postData);
        }
        if (postError) {
            const { status, statusText } = postError.request;
            notification.error({
                message: status,
                description: statusText,
            })
        }
        if (response && response.status === 201) {
            notification.success({
                message: response.status,
                description: 'Successfully created offer'
            })
        } 
    }, [postData, response, postError])

    return (
        <div>
            <Form form={form} name="offerForm">
                <div
                    className="p-6 overflow-y-auto"
                    style={{ maxHeight: "32rem" }}
                >
                    <OfferForm
                        offers={Object.values(offerStore.entities)}
                        datafields={datafieldStore.entities}
                        providers={providerStore.entities}
                        userId={userId}
                        file={file}
                        onChangeUpload={onChangeUpload}
                    />
                    <section className="mt-2">
                        <label className="mb-2 block">
                            Pathways - Table
                        </label>
                        <Table
                            columns={pathwayColumns}
                            dataSource={[]}
                            rowKey="id"
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

export default OfferCreationContainer;
