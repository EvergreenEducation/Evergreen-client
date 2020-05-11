import React, { useEffect, useState } from 'react';
import { Modal, Form, Table, Button, notification } from 'antd';
import ProviderForm from 'components/provider/ProviderForm';
import axiosInstance from 'services/AxiosInstance';
import { isNil, groupBy, orderBy, head } from 'lodash';
import { configure } from 'axios-hooks';
import useGlobalStore from 'store/GlobalStore';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';
import 'assets/scss/antd-overrides.scss';

configure({
  axios: axiosInstance,
});

const { Column } = Table;

const renderColumns = (nameTitle, descriptionTitle) => {
  return (
    <>
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
        title={nameTitle}
        dataIndex="name"
        key="name"
        render={(text, record) => ({
          children: text,
          props: {
            'data-title': nameTitle,
          },
        })}
      />
      <Column
        className="antd-col"
        title={descriptionTitle}
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
              'data-title': descriptionTitle,
            },
          };
        }}
      />
    </>
  );
};

export default function ProviderUpdateModal(props) {
  const { id: userId } = AuthService.currentSession;
  const [form] = Form.useForm();
  const formRef = React.createRef();
  const { provider = {}, onCancel, visible, datafields, role } = props;
  const { Offers = [], Pathways = [] } = provider;

  const { provider: providerStore } = useGlobalStore();
  const [file, setFile] = useState(null);
  const [onFileChange, setOnFileChange] = useState(false);

  const onChangeUpload = (e) => {
    const { file } = e;
    if (file) {
      setFile(file);
      setOnFileChange(true);
    }
  };

  const groupedDataFields = groupBy(provider.DataFields, 'type') || [];
  let providerType = null;
  if (groupedDataFields.provider && groupedDataFields.provider.length) {
    providerType = groupedDataFields.provider[0].id;
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
      ...p,
      type: providerType,
      topics: topics,
    });
  }

  useEffect(() => {
    formRef.current = form;
    if (formRef.current) {
      populateFields(provider, formRef);
    }

    if (provider.Files) {
      let orderedFiles = orderBy(
        provider.Files,
        ['fileable_type', 'createdAt', 'id'],
        ['desc', 'desc', 'id']
      );

      orderedFiles = orderedFiles.filter((f) => f.fileable_type === 'provider');
      setFile(head(orderedFiles));
    }
  }, [form, provider, provider.Files]);

  const submitUpdate = async () => {
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
      ]);

      const response = await axiosInstance.put(`/providers/${provider.id}`, {
        ...values,
        topics: values.topics,
      });

      if (response && response.status === 200) {
        if (response.data) {
          providerStore.updateOne(response.data);
        }
        if (onFileChange && response.data && file && userId) {
          const { name, type } = file;
          const results = await UploaderService.upload({
            name,
            mime_type: type,
            uploaded_by_user_id: userId,
            fileable_type: 'provider',
            fileable_id: response.data.id,
            binaryFile: file.originFileObj,
          });

          const providerEntity = providerStore.entities[response.data.id];
          providerEntity.Files.push({
            ...results.file.data,
          });

          providerStore.updateOne(providerEntity);

          if (results.success) {
            notification.success({
              message: 'Success',
              description: 'Image is uploaded',
            });
          }
        }

        notification.success({
          message: response.status,
          description: 'Successfully updated provider',
        });
        onCancel();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      forceRender={true}
      className="custom-modal"
      title={'Update Provider'}
      visible={visible}
      width={998}
      bodyStyle={{ backgroundColor: '#f0f2f5', padding: 0 }}
      footer={true}
      onCancel={onCancel}
      afterClose={() => {
        setFile(null);
      }}
    >
      <Form form={form}>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '32rem' }}>
          <ProviderForm
            role={role}
            datafields={datafields}
            userId={userId}
            onChangeUpload={onChangeUpload}
            file={file}
          />
          <section className="mt-2">
            <label className="mb-2 block">Offers - Table</label>
            <Table
              dataSource={Offers}
              rowClassName={() => 'antd-row'}
              className="ant-table-wrapper--responsive"
              rowKey="id"
              pagination={{ pageSize: 5 }}
            >
              {renderColumns('Offer Name', 'Offer Description')}
            </Table>
          </section>
          <section className="mt-2">
            <label className="mb-2 block">Pathways - Table</label>
            <Table
              dataSource={Pathways}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              className="ant-table-wrapper--responsive w-full"
              rowClassName={() => 'antd-row'}
            >
              {renderColumns('Name', 'Description')}
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
