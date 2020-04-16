import React, { useEffect, useState } from 'react';
import ProviderForm from 'components/provider/ProviderForm';
import { Button, Form, notification } from 'antd';
import useProviderDataFieldStore from 'components/provider/useProviderDataFieldStore';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';
import { isNil } from 'lodash';

configure({
    axios: axiosInstance,
})

const ProviderCreationContainer = (({ closeModal }) => {
    const { id: userId } = AuthService.currentSession;
    const [file, setFile] = useState(null);

    const onChangeUpload = (e) => {
        const { file } = e;
        if (file) {
            setFile(file);
        }
    }

    const [ form ] = Form.useForm();
    const store = useProviderDataFieldStore();
    const { datafield: datafieldStore, provider: providerStore } = store;
    const [{ data: postData, error: postError, response }, executePost ] = useAxios({
        url: '/providers',
        method: 'POST'
    }, { manual: true });
    
    const submit = async () => {
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
            "topics",
            "keywords"
        ]);

        const { name, location, type, learn_and_earn, is_public } = values;

        if (
            name && location && type && learn_and_earn && !isNil(is_public)
        ) {
            const response = await executePost({
                data: {
                    ...values,
                    topics: values.topics,
                }
            });

            if (response.data && file && userId) {
                const { name, type } = file;
                const results = await UploaderService.upload({
                    name,
                    mime_type: type,
                    uploaded_by_user_id: userId,
                    fileable_type: 'provider',
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
            providerStore.addOne(postData);
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
                description: 'Successfully created provider'
            })
        }
    }, [postData, response, postError]);


    return (
        <div>
            <Form
                form={form}
                name="providerForm"
            >
                <div
                    className="p-6 overflow-y-auto"
                    style={{ maxHeight: "32rem" }}
                >
                    <ProviderForm
                        userId={userId}
                        datafields={Object.values(datafieldStore.entities)}
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

export default ProviderCreationContainer;
