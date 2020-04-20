import React, {useEffect, useState} from 'react';
import {Table, Popconfirm, Button, Input, Col} from 'antd';
import useAxios, {configure} from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import EnrollmentStore from 'store/Enrollment';
import 'scss/antd-overrides.scss';
import {EnrollModal} from 'components/enrollment';
import matchSorter from 'match-sorter';

configure({
  axios: axiosInstance,
});

const {Column} = Table;

export default function EnrollmentTable({
  activateCreditAssignment,
  dataSource = [],
}) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [ search, setSearch ] = useState({
    searchString: '',
    searchedColumn: '',
  });
  const [enrollments, setEnrollments] = useState([]);

  const enrollmentStore = EnrollmentStore.useContainer();

  const [{
    data,
    error
  },
    executePut
  ] = useAxios({ method: 'PUT' }, {manual: true});

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

  
  const onCancel = e => {};
  
  const handleSearch = e => {
    setSearch({
      ...search,
      searchString: e.target.value
    });
  };
  
  const handleData = () => {
    const results = matchSorter(dataSource, search.searchString, { keys: ['Offer.name'] });
    setEnrollments(results);
  }
  
  const reset = () => {
    setEnrollments(dataSource);
  }
  
  useEffect(() => {
    if (dataSource) {
      setEnrollments(dataSource);
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
              <Col className="p-2 rounded">
                <Input
                  className="mb-2 w-48 rounded"
                  placeholder="Search offer name"
                  onChange={handleSearch}
                />
                <div>
                  <Button
                    className="mr-2 rounded"
                    type="primary"
                    size="small"
                    icon={
                      <FontAwesomeIcon
                        className="mr-1"
                        icon={faSearch}
                      />
                    }
                    onClick={() => handleData()}
                  >
                    Search
                  </Button>
                  <Button
                    className="rounded"
                    type="default"
                    size="small"
                    onClick={() => reset()}
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
