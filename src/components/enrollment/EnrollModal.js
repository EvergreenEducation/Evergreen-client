import React from 'react';
import { Modal, Form, Button, notification, Select, Col } from 'antd';
import axiosInstance from 'services/AxiosInstance';
import useGlobalStore from 'store/GlobalStore';
import 'assets/scss/antd-overrides.scss';

const { Option } = Select;

export default function EnrollModal({
  offer,
  onCancel,
  visible,
  students,
  enrollment,
}) {
  const { enrollment: enrollmentStore } = useGlobalStore();
  const [form] = Form.useForm();

  const submitEnrollment = async () => {
    if (enrollment && enrollment.id) {
      const values = await form.validateFields(['student_id']);
      if (values.student_id) {
        const { data, status } = await axiosInstance.put(
          `/enrollments/${enrollment.id}`,
          {
            student_id: values.student_id,
          }
        );

        if (data) {
          enrollmentStore.updateOne(data);
        }

        if (status === 200) {
          notification.success({
            message: 'Enrollment updated',
          });
          onCancel();
        }
      }
    }
  };

  return (
    <Modal
      forceRender={true}
      className="custom-modal"
      title={'Enroll Student'}
      visible={visible}
      width={520}
      bodyStyle={{ backgroundColor: '#f0f2f5', padding: 0 }}
      footer={true}
      onCancel={onCancel}
    >
      <Form form={form}>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '32rem' }}>
          <Col span={24} className="mb-5">
            <Form.Item
              label="Student"
              name="student_id"
              labelAlign={'left'}
              colon={false}
              className="mb-0 inherit flex-col w-full"
              rules={[{ required: true, message: 'Please select a student' }]}
              disabled={!students.length ? true : false}
            >
              <Select className="custom-select-rounded">
                {students &&
                  students.length &&
                  students.map(({ student_id }, index) => {
                    return (
                      <Option value={student_id} key={index}>
                        {student_id}
                      </Option>
                    );
                  })}
              </Select>
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
            Enroll
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
