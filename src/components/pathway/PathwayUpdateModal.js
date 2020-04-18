import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import DataFieldStore from 'store/DataField';
import PathwayForm from 'components/pathway/PathwayForm';
import dayjs from 'dayjs';
import 'scss/antd-overrides.scss';
import moment from 'moment';
import {
    groupBy, isNil, orderBy,
    map, head, reject,
} from 'lodash';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';
import OfferStore from 'store/Offer';

configure({
  axios: axiosInstance
});

export default function PathwayUpdateModal({
    pathway, onCancel, visible,
    pathwayStore, scopedToProvider, providers
}) {
    const { id: userId, provider_id } = AuthService.currentSession;
    const [file, setFile] = useState(null);
    const [ groupsOfOffers, setGroupsOfOffers ] = useState([]);

    const [ form ] = Form.useForm();
    const datafieldStore = DataFieldStore.useContainer();
    const offerStore = OfferStore.useContainer();
    const [{ data: putData, error: putError }, executePut ] = useAxios({
        method: 'PUT'
    }, { manual: true });

    const onChangeUpload = (e) => {
        const { file } = e;
        if (file) {
            setFile(file);
        }
    }

    const submitUpdate = async () => {
        let groups_of_offers = map(groupsOfOffers, g => {
          return {
            group_name: g.group_name,
            offer_ids: g.removed ? [] : map(g.offers, 'offer_id')
          }
        });

        const values = form.getFieldsValue([
            'description', 'learn_and_earn', 'frequency',
            'frequency_unit', 'credit_unit', 'pay_unit',
            'length', 'length_unit', 'name', 'start_date',
            'topics', 'pay', 'credit', 'outlook', 'earnings',
            'type', 'keywords', 'provider_id'
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
                    groups_of_offers,
                    start_date: dayjs(start_date).toISOString() || null,
                    updatedAt: new dayjs().toISOString()
                }
            });

            if (response && response.data) {
                pathwayStore.updateOne(response.data);
            }

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

            if (response && response.status === 200) {
                onCancel();
                notification.success({
                    message: response.status,
                    description: 'Successfully updated pathway'
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
            ...p,
            start_date: moment(p.start_date),
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
        if (pathway) {
            populateFields(pathway, form);
        }
        if (pathway.Files) {
            const orderedFiles = orderBy(pathway.Files, ['fileable_type', 'createdAt'], ['desc', 'desc']);
            for (let i = 0; i < orderedFiles.length; i++) {
                if (!orderedFiles[i]) {
                    break;
                }

                if (orderedFiles[i].fileable_type === 'pathway') {
                    setFile(orderedFiles[i]);
                    break;
                }
            }
        }
    }, [putData, pathway, putError]);

    let providerEntities = providers;

    if (scopedToProvider) {
        if (providerEntities.length) {
            providerEntities = reject(providerEntities, p => {
                return !(p.id === provider_id);
            });

            form.setFieldsValue({
                provider_id: head(providerEntities).id || null,
            });
        }
    }

    return (
        <Modal
            forceRender={true}
            className="custom-modal"
            title={"Update Pathway"}
            visible={visible}
            width={998}
            bodyStyle={{ backgroundColor: "#f0f2f5", padding: 0 }}
            footer={true}
            onCancel={onCancel}
            afterClose={() => {
                setFile(null)
            }}
        >
            <Form form={form}>
                <div
                    className="p-6 overflow-y-auto"
                    style={{ maxHeight: "32rem" }}
                >
                    <PathwayForm
                        pathway={pathway}
                        datafields={datafieldStore.entities}
                        offers={Object.values(offerStore.entities)}
                        groupsOfOffers={groupsOfOffers}
                        setGroupsOfOffers={setGroupsOfOffers}
                        userId={userId}
                        onChangeUpload={onChangeUpload}
                        file={file}
                        providers={providerEntities}
                        scopedToProvider={true}
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
