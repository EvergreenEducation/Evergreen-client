import React, {useEffect, useState} from 'react';
import {Table, Popconfirm, Button, Input} from 'antd';
import useAxios, {configure} from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import EnrollmentStore from 'store/Enrollment';
import 'scss/antd-overrides.scss';
import {EnrollModal} from 'components/enrollment';

configure({
  axios: axiosInstance,
});

const {Column} = Table;

export default function EnrollmentTable({
  selectedOffer,
  activateCreditAssignment,
}) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const enrollmentStore = EnrollmentStore.useContainer();

  const [{data: enrollmentBody }] = useAxios(
    `/enrollments?offer_id=${selectedOffer.id}`
  );

  const [{data: putResponseBody, error: putError}, executePut] = useAxios(
    {
      method: 'PUT',
    },
    {manual: true}
  );

  const setStatusToApprove = async enrollmentId => {
    try {
      const response = await executePut({
        url: `/enrollments/${enrollmentId}`,
        data: {
          status: 'Approved',
        },
      });

      if (response.status === 200) {
        enrollmentStore.updateOne(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (enrollmentBody) {
      enrollmentStore.addMany(enrollmentBody);
    }
  }, [selectedOffer, enrollmentBody]);

  const onCancel = e => {};

  const tableData = Object.values(enrollmentStore.entities).filter(e => {
    return e.offer_id === selectedOffer.id;
  });

  return (
    <>
      <Table
        dataSource={tableData}
        bordered
        className="ant-table-wrapper--responsive"
        rowClassName={() => 'antd-row'}
        rowKey="id"
      >
        <Column
          className="antd-col"
          title="Student ID"
          dataIndex="student_id"
          key="student_id"
          render={(text, record) => ({
            children: record.student_id ? (
              record.student_id
            ) : (
              <Button
                className="rounded"
                type="primary"
                onClick={() => {
                  setSelectedEnrollment(record);
                  setModalVisibility(true);
                }}
              >
                Enroll Student
              </Button>
            ),
            props: {
              'data-title': 'Student ID',
            },
          })}
        />
        <Column
          className="antd-col"
          title="Activation Code"
          dataIndex="activation_code"
          key="activation_code"
          render={(text, record) => ({
            children: text,
            props: {
              'data-title': 'Activation Code',
            },
          })}
        />
        <Column
          className="antd-col"
          title="Credit"
          dataIndex="credit"
          key="credit"
          width={200}
          render={(text, record) => ({
            children: activateCreditAssignment ? (
              <Input addonBefore="Score" className="w-64" />
            ) : (
              text
            ),
            props: {
              'data-title': 'Credit',
            },
          })}
        />
        <Column
          className="antd-col"
          title="Status"
          dataIndex="status"
          key="status"
          render={(text, record) => ({
            children: text,
            props: {
              'data-title': 'Status',
            },
          })}
        />
        <Column
          className="antd-col"
          title="Action"
          key="index"
          render={enrollment => {
            return {
              children: (
                <Popconfirm
                  className="cursor-pointer"
                  title="Do you want to give this student their credit?"
                  onConfirm={() => setStatusToApprove(enrollment.id)}
                  onCancel={onCancel}
                  okText="Yes"
                  cancelText="No"
                  disabled={enrollment.status === 'Approved' ? true : false}
                >
                  <span
                    style={{
                      color:
                        enrollment.status === 'Approved'
                          ? '#cbd5e0'
                          : '#1890ff',
                      cursor:
                        enrollment.status === 'Approved'
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                  >
                    Approve
                  </span>
                </Popconfirm>
              ),
              props: {
                'data-title': 'Action',
              },
            };
          }}
        />
      </Table>
      <EnrollModal
        enrollment={selectedEnrollment}
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
      />
    </>
  );
}
