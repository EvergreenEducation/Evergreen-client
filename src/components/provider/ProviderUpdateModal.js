import React, { useEffect, useState } from 'react';
import { Modal, Form, Table, Button, notification } from 'antd';
import ProviderForm from 'components/provider/ProviderForm';
import axiosInstance from 'services/AxiosInstance';
import { isNil, groupBy, orderBy } from 'lodash';
import { configure } from 'axios-hooks';
import ProviderStore from 'store/Provider';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';
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
    const { id: userId } = AuthService.currentSession;
    const [ form ] = Form.useForm();
    const formRef = React.createRef();
    const { provider, onCancel, visible, datafields } = props;
    const { Offers = [] } = provider;
    const providerStore = ProviderStore.useContainer();
    const [file, setFile] = useState(null);

    const onChangeUpload = (e) => {
        const { file } = e;
        if (file) {
            setFile(file);
        }
    }

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
            news: p.news,
            keywords: p.keywords,
        });
    }

    useEffect(() => {
        formRef.current = form;
        if (formRef.current) {
            populateFields(provider, formRef);
        }

        if (provider.Files) {
            const orderedFiles = orderBy(provider.Files, ['fileable_type', 'createdAt'], ['desc', 'desc']);
            for (let i = 0; i < orderedFiles.length; i++) {
                if (!orderedFiles[i]) {
                    break;
                }

                if (orderedFiles[i].fileable_type === 'provider') {
                    setFile(orderedFiles[i]);
                    break;
                }
            }
        }
    }, [props, form, provider, provider.Files]);

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
            "topics",
            "keywords"
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

                if (response && response.status === 200) {
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


                    providerStore.updateOne(response.data);
                    onCancel();
                    notification.success({
                        message: response.status,
                        description: 'Successfully updated provider'
                    })
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
            afterClose={() => {
                setFile(null)
            }}
        >
            <Form form={form}>
                <div
                    className="p-6 overflow-y-auto"
                    style={{ maxHeight: "32rem" }}
                >
                    <ProviderForm
                        datafields={datafields}
                        userId={userId}
                        onChangeUpload={onChangeUpload}
                        file={file}
                    />
                    <section className="mt-2">
                        <label className="mb-2 block">
                            Offers - Table
                        </label>
                        <Table
                            columns={offerColumns}
                            dataSource={Offers}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                        />
                    </section>
                    <section className="mt-2">
                        <label className="mb-2 block">
                            Pathways - Table
                        </label>
                        <Table
                            columns={pathwayColumns}
                            dataSource={[]}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
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