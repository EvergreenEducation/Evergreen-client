import React, { useEffect, useState } from 'react';
import ProviderForm from 'components/provider/ProviderForm';
import { Button, Form, notification } from 'antd';
import useGlobalStore from 'store/GlobalStore';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';

configure({
  axios: axiosInstance,
});

const ProviderCreationContainer = ({ closeModal }) => {
  const { id: userId } = AuthService.currentSession;
  const [file, setFile] = useState(null);

  const onChangeUpload = (e) => {
    const { file } = e;
    if (file) {
      setFile(file);
    }
  };

  const [form] = Form.useForm();
  const {
    datafield: datafieldStore,
    provider: providerStore,
  } = useGlobalStore();
  const [
    { data: providerPayload, error: providerCreateError },
    createProvider,
  ] = useAxios(
    {
      url: '/providers',
      method: 'POST',
    },
    { manual: true }
  );

  const submit = async () => {
    try {
      const values = await form.validateFields([
        'name',
        'location',
        'type',
        'learn_and_earn',
        'is_public',
        'industry',
        'description',
        'industry',
        'financial_aid',
        'credit',
        'news',
        'contact',
        'pay',
        'cost',
        'topics',
        'keywords',
      ]);

      const response = await createProvider({
        data: {
          ...values,
          topics: values.topics,
        },
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

        response.data.Files = [{ ...results.file.data }];

        providerStore.updateOne(response.data);

        if (results.success) {
          notification.success({
            message: 'Success',
            description: 'Image is uploaded',
          });
        }
      }

      if (response && response.status === 201) {
        form.resetFields();
        closeModal();
        notification.success({
          message: response.status,
          description: 'Successfully created provider',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (providerPayload) {
      providerStore.addOne(providerPayload);
    }
    if (providerCreateError) {
      const { status, statusText } = providerCreateError.request;
      notification.error({
        message: status,
        description: statusText,
      });
    }
  }, [providerPayload, providerCreateError]);

  return (
    <div>
      <Form form={form} name="providerForm">
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '32rem' }}>
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
            borderTop: '1px solid #f0f0f0',
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
};

export default ProviderCreationContainer;
