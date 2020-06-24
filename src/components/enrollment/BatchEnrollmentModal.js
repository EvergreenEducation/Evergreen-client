import React from 'react';
import {
  Modal,
  Form,
  Button,
  notification,
  Col,
  InputNumber,
  Row,
  DatePicker,
} from 'antd';
import dayjs from 'dayjs';
import axiosInstance from 'services/AxiosInstance';
import EnrollmentStore from 'store/Enrollment';
import 'assets/scss/antd-overrides.scss';

export default function EnrollModal({ offer, onCancel, visible, onSubmit }) {
  const enrollmentStore = EnrollmentStore.useContainer();
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

      const values = await form.validateFields(['batch', 'start_date']);
      const { start_date } = values;
      const createEnrollment = await axiosInstance.post(
        '/enrollments/batch_create',
        {
          ...values,
          start_date: start_date ? dayjs(start_date).toISOString() : null,
          offer_id: offer.id,
          provider_id: offer.provider_id,
        }
      );

      if (createEnrollment.status === 201) {
        const enrollmentResponse = await axiosInstance.get(
          `/enrollments?offer_id=${offer.id}&provider_id=${offer.provider_id}`
        );

        enrollmentStore.addMany(enrollmentResponse.data);

        notification.success({
          message: 'Success',
          description: 'Batch enrollments have been created.',
        });
        onSubmit();
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
      bodyStyle={{ backgroundColor: '#f0f2f5', padding: 0 }}
      footer={true}
      onCancel={onCancel}
    >
      <Form form={form}>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '32rem' }}>
          <Row gutter={8} className="pb-5">
            <Col sm={12} md={12} xs={24}>
              <Form.Item
                label="Number of enrollments"
                labelAlign={'left'}
                name="batch"
                colon={false}
                className="mb-0 inherit flex-col w-full"
                rules={[{ required: true, message: 'This field is required' }]}
              >
                <InputNumber className="rounded w-full" min={0} />
              </Form.Item>
            </Col>
            <Col sm={12} md={12} xs={24}>
              <Form.Item
                label="Start Date"
                name="start_date"
                labelAlign={'left'}
                colon={false}
                className="mb-0 inherit"
                rules={[{ required: true, message: 'This field is required' }]}
              >
                <DatePicker
                  className="w-full custom-datepicker rounded"
                  format="MM-DD-YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
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
