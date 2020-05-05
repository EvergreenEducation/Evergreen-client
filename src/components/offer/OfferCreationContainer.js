import React, { useEffect, useState } from 'react';
import { Button, Form, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import OfferForm from 'components/offer/OfferForm';
import useGlobalStore from 'store/GlobalStore';
import dayjs from 'dayjs';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';
import { head, reject } from 'lodash';

configure({
  axios: axiosInstance,
});

const OfferCreationContainer = ({ closeModal, role, providerId }) => {
  const { id: userId, provider_id } = AuthService.currentSession;

  const [file, setFile] = useState(null);
  const [form] = Form.useForm();
  const [{ data: offerPayload, error: offerError }, createOffer] = useAxios(
    {
      url: '/offers',
      method: 'POST',
    },
    { manual: true }
  );

  const onChangeUpload = (e) => {
    const { file } = e;
    if (file) {
      setFile(file);
    }
  };

  const {
    datafield: datafieldStore,
    provider: providerStore,
    offer: offerStore,
  } = useGlobalStore();

  let providerEntities = Object.values(providerStore.entities);

  if (role === 'provider') {
    if (providerEntities.length) {
      providerEntities = reject(providerEntities, (p) => {
        return !(p.id === providerId);
      });

      form.setFieldsValue({
        provider_id: head(providerEntities).id,
      });
    }
  }

  const submit = async () => {
    try {
      const values = await form.validateFields([
        'category',
        'description',
        'learn_and_earn',
        'part_of_day',
        'frequency',
        'frequency_unit',
        'cost',
        'cost_unit',
        'credit_unit',
        'pay_unit',
        'length',
        'length_unit',
        'name',
        'start_date',
        'provider_id',
        'topics',
        'pay',
        'credit',
        'related_offers',
        'prerequisites',
        'keywords',
      ]);

      const { start_date } = values;

      const offerResponse = await createOffer({
        data: {
          ...values,
          start_date: dayjs(start_date).toISOString() || null,
          provider_id,
        },
      });

      if (offerResponse.data) {
        offerStore.addOne(offerResponse.data);
      }

      if (offerResponse.data && file && userId) {
        const { name, type } = file;
        const results = await UploaderService.upload({
          name,
          mime_type: type,
          uploaded_by_user_id: userId,
          fileable_type: 'offer',
          fileable_id: offerResponse.data.id,
          binaryFile: file.originFileObj,
        });

        offerResponse.data.Files = [{ ...results.file.data }];

        offerStore.updateOne(offerResponse);

        if (results.success) {
          notification.success({
            message: 'Success',
            description: 'Image is uploaded',
          });
        }
      }

      if (offerResponse && offerResponse.status === 201) {
        notification.success({
          message: offerResponse.status,
          description: 'Successfully created offer',
        });
        form.resetFields();
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (offerError) {
      const { status, statusText } = offerError.request;
      notification.error({
        message: status,
        description: statusText,
      });
    }
  }, [offerPayload, offerError]);

  return (
    <div>
      <Form form={form} name="offerForm">
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '32rem' }}>
          <OfferForm
            role={role}
            offers={Object.values(offerStore.entities)}
            datafields={datafieldStore.entities}
            providers={providerEntities}
            userId={userId}
            providerId={provider_id}
            file={file}
            onChangeUpload={onChangeUpload}
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

export default OfferCreationContainer;
