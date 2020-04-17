import React from 'react';
import {Modal, Form, Button, notification, Col, InputNumber} from 'antd';
import axiosInstance from 'services/AxiosInstance';
import 'scss/antd-overrides.scss';

export default function EnrollModal({offer, onCancel, visible}) {
  const [form] = Form.useForm();

  const submitEnrollment = async () => {
    try {
      if (!offer || !offer.id) {
        notification.warning({
          message: 'Error',
          description: "Could not fetch the offer's information.",
        });
        return;
      }

      const values = await form.validateFields('');

      const createEnrollment = await axiosInstance.post(
        '/enrollments/batch_create',
        {
          ...values,
          offer_id: offer.id,
        }
      );

      if (createEnrollment.status === 201) {
        notification.success({
          message: 'Success',
          description: 'Student has been enrolled.',
        });
        onCancel();
      } else {
        notification.warning({
          message: createEnrollment.status,
          description: createEnrollment.statusText,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      forceRender={true}
      className="custom-modal"
      title={'Create Batch Enrollments'}
      visible={visible}
      width={520}
      bodyStyle={{backgroundColor: '#f0f2f5', padding: 0}}
      footer={true}
      onCancel={onCancel}
    >
      <Form form={form}>
        <div className="p-6 overflow-y-auto" style={{maxHeight: '32rem'}}>
          <Col span={24} className="mb-5">
            <Form.Item
              label="Number of enrollments"
              labelAlign={'left'}
              name="batch"
              colon={false}
              className="mb-0 inherit flex-col w-full"
              rules={[{required: true, message: 'This field is required'}]}
            >
              <InputNumber className="rounded" />
            </Form.Item>
          </Col>
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
            onClick={submitEnrollment}
          >
            Create
          </Button>
          <Button
            className="px-10 rounded"
            size="small"
            type="dashed"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </section>
      </Form>
    </Modal>
  );
}
