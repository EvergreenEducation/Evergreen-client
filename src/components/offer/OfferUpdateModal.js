import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Table, Button, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import useGlobalStore from 'store/GlobalStore';
import OfferForm from 'components/offer/OfferForm';
import dayjs from 'dayjs';
import moment from 'moment';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';
import { compact, orderBy, head } from 'lodash';
import 'assets/scss/antd-overrides.scss';

configure({
  axios: axiosInstance,
});

const { Column } = Table;

export default function OfferUpdateModal({
  offer,
  onCancel,
  visible,
  offerStore,
  scopedToProvider = false,
  role,
}) {
  const formRef = useRef(null);
  const { id: userId, provider_id } = AuthService.currentSession;
  const [file, setFile] = useState(null);
  const [onFileChange, setOnFileChange] = useState(false);

  const {
    RelatedOffers = [],
    PrerequisiteOffers = [],
    DataFields = [],
    GroupsOfOffers: Pathways = [],
  } = offer;

  const [form] = Form.useForm();

  const onChangeUpload = (e) => {
    const { file } = e;
    if (file) {
      setFile(file);
      setOnFileChange(true);
    }
  };

  const [
    { data: updateOfferPayload, error: updateOfferError },
    updateOffer,
  ] = useAxios(
    {
      method: 'PUT',
    },
    { manual: true }
  );

  const {
    datafield: datafieldStore,
    provider: providerStore,
  } = useGlobalStore();

  const submitUpdate = async () => {
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
        'keywords',
        'related_offers',
        'prerequisites',
        'is_local_promo',
        'is_main_promo',
      ]);

      const { start_date } = values;

      const response = await updateOffer({
        url: `/offers/${offer.id}`,
        data: {
          ...values,
          start_date: dayjs(start_date).toISOString() || null,
          updatedAt: new dayjs().toISOString(),
        },
      });

      if (onFileChange && response.data && file && userId) {
        const { name, type } = file;
        const results = await UploaderService.upload({
          name,
          mime_type: type,
          uploaded_by_user_id: userId,
          fileable_type: 'offer',
          fileable_id: response.data.id,
          binaryFile: file.originFileObj,
        });

        const offerEntity = offerStore.entities[response.data.id];
        offerEntity.Files.push({
          ...results.file.data,
        });

        offerStore.updateOne(offerEntity);

        if (results.success) {
          notification.success({
            message: 'Success',
            description: 'Image is uploaded',
          });
        }
      }

      if (response && response.status === 200) {
        offerStore.updateOne(response.data);
        notification.success({
          message: response.status,
          description: 'Successfully updated offer',
        });
        onCancel();
      }
    } catch (error) {
      console.error(error);
    }
  };

  function populateFields(o) {
    form.setFieldsValue({
      ...o,
      part_of_day: Number(o.part_of_day),
      pay_unit: Number(o.pay_unit),
      length_unit: Number(o.length_unit),
      credit_unit: Number(o.credit_unit),
      frequency_unit: Number(o.frequency_unit),
      category: Number(o.category),
      cost_unit: Number(o.cost_unit),
      start_date: moment(o.start_date),
      topics: compact(
        DataFields.map(({ type, id }) => {
          if (type === 'topic') {
            return id;
          }
          return null;
        })
      ),
      related_offers: RelatedOffers.map(({ id }) => id),
      prerequisites: PrerequisiteOffers.map(({ id }) => id),
    });
  }

  useEffect(() => {
    if (updateOfferError) {
      const { status, statusText } = updateOfferError.request;
      notification.error({
        message: status,
        description: statusText,
      });
    }
    if (formRef.current) {
      populateFields(offer);
    }
    if (offer.Files) {
      let orderedFiles = orderBy(
        offer.Files,
        ['fileable_type', 'createdAt', 'id'],
        ['desc', 'desc', 'asc']
      );
      orderedFiles = orderedFiles.filter((f) => f.fileable_type === 'offer');
      setFile(head(orderedFiles));
    }
  }, [updateOfferPayload, offer, updateOfferError, formRef]);

  return (
    <Modal
      forceRender={true}
      className="custom-modal"
      title={'Update Offer'}
      visible={visible}
      width={998}
      bodyStyle={{ backgroundColor: '#f0f2f5', padding: 0 }}
      footer={true}
      onCancel={onCancel}
      afterClose={() => {
        setFile(null);
      }}
    >
      <Form form={form} ref={formRef}>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '32rem' }}>
          <OfferForm
            offers={Object.values(offerStore.entities)}
            datafields={datafieldStore.entities}
            providers={providerStore.entities}
            offer={offer}
            userId={userId}
            providerId={provider_id}
            onChangeUpload={onChangeUpload}
            file={file}
            scopedToProvider={scopedToProvider}
            role={role}
          />
          <section className="mt-2">
            <label className="mb-2 block">Pathways - Table</label>
            <Table
              dataSource={Pathways}
              className="ant-table-wrapper--responsive"
              rowClassName={() => 'antd-row'}
              rowKey="id"
            >
              <Column
                className="antd-col"
                title="ID"
                dataIndex="id"
                key="id"
                render={(text, record) => ({
                  children: text,
                  props: {
                    'data-title': 'ID',
                  },
                })}
              />
              <Column
                className="antd-col"
                title="Pathway Name"
                dataIndex="name"
                key="name"
                render={(text, record) => ({
                  children: text,
                  props: {
                    'data-title': 'Pathway Name',
                  },
                })}
              />
              <Column
                className="antd-col"
                title="Pathway Description"
                dataIndex="description"
                key="index"
                render={(text, record) => {
                  let children = 'N/A';
                  if (text.length) {
                    children = text;
                  }
                  return {
                    children: children,
                    props: {
                      'data-title': 'Pathway Description',
                    },
                  };
                }}
              />
            </Table>
          </section>
        </div>
        <section
          className="bg-white px-6 pt-5 pb-1 flex justify-center"
          style={{
            borderTop: '1px solid #f0f0f0',
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
