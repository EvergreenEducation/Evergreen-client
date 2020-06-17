import React, { useEffect } from 'react';
import ProviderForm from 'components/provider/ProviderForm';
import { Button, Form, notification } from 'antd';
import useGlobalStore from 'store/GlobalStore';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';
import { useImageAndBannerImage } from 'hooks';

configure({
  axios: axiosInstance,
});

const ProviderCreationContainer = ({ closeModal, role }) => {
  const { id: userId } = AuthService.currentSession;
  const [
    { file, onChangeFileUpload },
    { bannerFile, onChangeBannerUpload },
  ] = useImageAndBannerImage();

  const [form] = Form.useForm();
  const {
    datafield: datafieldStore,
    provider: providerStore,
  } = useGlobalStore();
  const [{ error: providerCreateError }, createProvider] = useAxios(
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
        'is_local_promo',
        'is_main_promo',
        'external_url',
      ]);

      const { data, status } = await createProvider({
        data: {
          ...values,
          topics: values.topics,
        },
      });

      if (data) {
        providerStore.addOne(data);
      }

      if (data && userId) {
        const fileable_type = 'provider';
        let clonedResponse = Object.assign(data);
        const filePayload = [];
        if (file) {
          const results = await UploaderService.uploadFile(file, {
            uploaded_by_user_id: userId,
            fileable_type,
            fileable_id: data.id,
          });

          if (results && results.file.data) {
            filePayload.push({ ...results.file.data });
          }

          if (results.success) {
            notification.success({
              message: 'Success',
              description: 'Main image is uploaded',
            });
          }
        }
        if (bannerFile) {
          const results = await UploaderService.uploadFile(bannerFile, {
            uploaded_by_user_id: userId,
            fileable_type,
            fileable_id: data.id,
            meta: 'banner-image',
          });

          if (results && results.file.data) {
            filePayload.push({ ...results.file.data });
          }

          if (results.success) {
            notification.success({
              message: 'Success',
              description: 'Banner image is uploaded',
            });
          }
        }
        clonedResponse.Files = [...filePayload];
        providerStore.updateOne(clonedResponse);
      }

      if (status === 201) {
        notification.success({
          message: status,
          description: 'Successfully created provider',
        });
        form.resetFields();
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (providerCreateError) {
      const { status, statusText } = providerCreateError.request;
      notification.error({
        message: status,
        description: statusText,
      });
    }
  }, [providerCreateError]);

  return (
    <div>
      <Form form={form} name="providerForm">
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '32rem' }}>
          <ProviderForm
            role={role}
            userId={userId}
            datafields={Object.values(datafieldStore.entities)}
            file={file}
            onChangeUpload={onChangeFileUpload}
            bannerFile={bannerFile}
            onChangeBannerUpload={onChangeBannerUpload}
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
