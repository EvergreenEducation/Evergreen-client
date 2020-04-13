import React, { useEffect, useState } from 'react';
import { Button, Form, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import PathwayForm from 'components/pathway/PathwayForm';
import DataFieldStore from 'store/DataField';
import PathwayStore from 'store/Pathway';
import dayjs from 'dayjs';
import OfferStore from 'store/Offer';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';

configure({
    axios: axiosInstance,
})

const PathwayCreationContainer = (({ className, closeModal }) => {
    const { id: userId } = AuthService.currentSession;
    const [file, setFile] = useState(null);
    const [ groupsOfOffers, setGroupsOfOffers ] = useState([]);
    const [ form ] = Form.useForm();
    const pathwayStore = PathwayStore.useContainer();
    const offerStore = OfferStore.useContainer();

    const onChangeUpload = (e) => {
        const { file } = e;
        if (file) {
            setFile(file);
        }
    }

    const [{
        data: getDataFields,
    }] = useAxios('/datafields');

    const [{
        data: getOffers,
    }] = useAxios('/offers');
    
    const [{ data: postData, error: postError, response }, executePost ] = useAxios({
        url: '/pathways',
        method: 'POST'
    }, { manual: true });

    const datafieldStore = DataFieldStore.useContainer();

    const submit = async () => {
        const groups_of_offers = groupsOfOffers.map(({ group_name, inputName}) => {
            const value = form.getFieldValue(inputName);
            return {
                group_name,
                offer_ids: value,
            }
        });

        console.log(groups_of_offers);

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
                    groups_of_offers,
                    start_date: dayjs(start_date).toISOString() || null
                }
            });

            if (response.data && file && userId) {
                const { name, type } = file;
                const results = await UploaderService.upload({
                    name,
                    mime_type: type,
                    uploaded_by_user_id: userId,
                    fileable_type: 'pathway',
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
        if (response && response.status === 201) {
            notification.success({
                message: response.status,
                description: 'Successfully created pathway'
            })
        }
        if (getOffers) {
            offerStore.addMany(getOffers);
        }
    }, [getDataFields, response, postError])

    return (
        <div>
            <Form form={form} name="offerForm">
                <div
                    className="p-6 overflow-y-auto"
                    style={{ maxHeight: "32rem" }}
                >
                    <PathwayForm
                        datafields={datafieldStore.entities}
                        offers={Object.values(offerStore.entities)}
                        groupsOfOffers={groupsOfOffers}
                        setGroupsOfOffers={setGroupsOfOffers}
                        userId={userId}
                        onChangeUpload={onChangeUpload}
                        file={file}
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
