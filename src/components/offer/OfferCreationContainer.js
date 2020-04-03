import React from 'react';
import { Table, Button, Form } from 'antd';
import useProviderDataFieldStore from 'components/provider/useProviderDataFieldStore';
import { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import OfferForm from 'components/offer/OfferForm';

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

const OfferCreationContainer = (({ className, closeModal }, ref) => {
    const [ form ] = Form.useForm();
    const store = useProviderDataFieldStore();
    const { datafield: datafieldStore, provider: providerStore } = store;
    
    const submit = async () => {}

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
                    <OfferForm
                        datafields={Object.values(datafieldStore.entities)}
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
