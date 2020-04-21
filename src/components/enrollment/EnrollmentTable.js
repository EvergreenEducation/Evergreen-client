import React, {useEffect, useState} from 'react';
import {
  Table, Popconfirm, Button,
  Input, Col, Select, Form
} from 'antd';
import axiosInstance from 'services/AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import EnrollmentStore from 'store/Enrollment';
import 'scss/antd-overrides.scss';
import {EnrollModal} from 'components/enrollment';
import matchSorter from 'match-sorter';
import { useForm } from 'antd/lib/form/util';
import 'scss/antd-overrides.scss';
const { Column } = Table;
const { Option } = Select;

export default function EnrollmentTable({
  activateCreditAssignment,
  dataSource = [],
  offer,
}) {

  let filteredDataSource = dataSource;
  let presetOfferName = null;

  if (offer) {
    filteredDataSource = dataSource.filter(enrollment => {
      if (enrollment.offer_id === offer && presetOfferName !== enrollment.Offer.name) {
        presetOfferName = enrollment.Offer.name;
      }
      return enrollment.offer_id === offer;
    });
  }

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [ form ] = useForm();

  const enrollmentStore = EnrollmentStore.useContainer();

  const updateEnrollment = async (enrollment) => {
    return axiosInstance.put(`/enrollments/${enrollment.id}?scope=with_offers`, {
      status: 'Approved',
    });
  }

  const setStatusToApprove = async enrollment => {
    try {
      const response = await updateEnrollment(enrollment);

      if (response.status === 200) {
        enrollmentStore.updateOne(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleData = async () => {
    const value = await form.validateFields(['offer_name']);
    let offerName = '';
    if (value) {
      offerName = value.offer_name;
    }
    const results = matchSorter(dataSource, offerName, { keys: ['Offer.name'] });
    setEnrollments(results);
  }
  
  const reset = () => {
    form.setFieldsValue({
      offer_name: null,
    });
    setEnrollments(dataSource);
  }

  const offerNames = [];

  let name = null;
  for (let i = 0; i < dataSource.length; i++) {
    if (!dataSource[i] || !dataSource[i].Offer) {
      break;
    }
    name = dataSource[i].Offer.name;
    if (!offerNames.includes(name)) {
      offerNames.push(name);
    }
  }
  
  useEffect(() => {
    if (dataSource) {
      setEnrollments(filteredDataSource);
    }
  }, [dataSource]);

  return (
    <>
      <Table
        dataSource={enrollments}
        bordered
        className="ant-table-wrapper--responsive"
        rowClassName={() => 'antd-row'}
        rowKey="id"
      >
        <Column
          className="antd-col"
          title="Offer Name"
          dataIndex="Offer"
          key="index"
          render={offer => {
            let children = 'N/A';
            if (offer && offer.name) {
              children = offer.name;
            }
            return {
              children,
              props: {
                'data-title': 'Offer Name',
              },
            };
          }}
          filterIcon={filtered => (
            <FontAwesomeIcon
              style={{
                color: filtered ? '#1890ff' : undefined,
              }}
              icon={faSearch}
            />
          )}
          filterDropdown={(params) => {
            return (
              <Form
                form={form}
                initialValues={{
                  offer_name: presetOfferName
                }}
              >
                <Col className="p-2 rounded">
                  <Form.Item
                    className="mb-2"
                    name="offer_name"
                  >
                    <Select
                      className="custom-select"
                      style={{ minWidth: "12rem" }}
                      showSearch
                    >
                      {
                        offerNames.map((name, index) => {
                          return (
                            <Option
                              key={index.toString()}
                              value={name}
                            >
                              {name}
                            </Option>
                          );
                        })
                      }
                    </Select>
                  </Form.Item>
                  <div>
                    <Button
                      className="mr-2 rounded"
                      type="primary"
                      size="small"
                      onClick={handleData}
                    >
                      Search
                    </Button>
                    <Button
                      className="rounded"
                      type="default"
                      size="small"
                      onClick={reset}
                    >
                      Reset
                    </Button>
                  </div>
                </Col>
              </Form>
            );
          }}
        />
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
                  setEnrollModalOpen(true);
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
          filterIcon={filtered => (
            <FontAwesomeIcon
              style={{
                color: filtered ? '#1890ff' : undefined,
              }}
              icon={faSearch}
            />
          )}
          filterDropdown={(params) => {
            return (
              <Col className="p-2 rounded">
                <Input
                  className="mb-2 w-48 rounded"
                  placeholder="Search credit"
                  disabled
                />
                <div>
                  <Button
                    disabled
                    className="mr-2 rounded"
                    type="primary"
                    size="small"
                    icon={
                      <FontAwesomeIcon
                        className="mr-1"
                        icon={faSearch}
                      />
                    }
                  >
                    Search
                  </Button>
                  <Button
                    disabled
                    className="rounded"
                    type="default"
                    size="small"
                  >
                    Reset
                  </Button>
                </div>
              </Col>
            );
          }}
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
                  onConfirm={() => setStatusToApprove(enrollment)}
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
        visible={enrollModalOpen}
        onCancel={() => setEnrollModalOpen(false)}
      />
    </>
  );
}
