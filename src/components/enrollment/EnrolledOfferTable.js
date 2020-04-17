import React, {useEffect} from 'react';
import {Table, Button, Tag} from 'antd';
import dayjs from 'dayjs';
import 'scss/antd-overrides.scss';

const {Column} = Table;

export default function EnrolledOfferTable({
  data = [],
  providers,
  datafields,
  openEnrollModal,
  openEnrollments,
}) {
  useEffect(() => {}, [data]);

  return (
    <Table
      dataSource={data}
      bordered
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
        title="Name"
        dataIndex="name"
        key="name"
        render={(text, record) => ({
          children: text,
          props: {
            'data-title': 'Name',
          },
        })}
      />
      <Column
        className="antd-col"
        title="Category"
        dataIndex="category"
        key="category"
        render={id => {
          let name = null;
          if (datafields[id]) {
            name = datafields[id].name;
          }
          return {
            children: name,
            props: {'data-title': 'Category'},
          };
        }}
      />
      <Column
        className="antd-col"
        title="Provider"
        dataIndex="provider_id"
        key="provider_id"
        render={id => {
          let name = 'N/A';
          if (providers[id]) {
            name = providers[id].name;
          }
          return {
            children: name,
            props: {'data-title': 'Provider'},
          };
        }}
      />
      <Column
        className="antd-col"
        title="Topics"
        dataIndex="DataFields"
        key="DataFields"
        render={(datafields = [], record) => {
          datafields = datafields.filter(d => d.type === 'topic');
          let children = 'N/A';

          if (datafields.length) {
            children = (
              <>
                {datafields.map((datafield, index) => {
                  if (datafield.type !== 'topic') {
                    return null;
                  }
                  return (
                    <Tag
                      color={index % 2 ? 'blue' : 'orange'}
                      key={index.toString()}
                    >
                      {datafield.name}
                    </Tag>
                  );
                })}
              </>
            );
          }

          return {
            children,
            props: {
              'data-title': 'Topics',
            },
          };
        }}
      />
      <Column
        className="antd-col"
        title="Start Date"
        dataIndex="start_date"
        key="start_date"
        render={date => {
          return {
            children: dayjs(date).format('MMM DD, YYYY'),
            props: {'data-title': 'Start Date'},
          };
        }}
      />
      <Column
        className="antd-col"
        title="Actions"
        key="update"
        render={(text, offer) => {
          return {
            children: (
              <div>
                <Button
                  className="rounded"
                  type="primary"
                  onClick={() => openEnrollModal(offer)}
                >
                  Create Batch Enrollments
                </Button>
                <Button type="link" onClick={() => openEnrollments(offer)}>
                  View enrollments
                </Button>
              </div>
            ),
            props: {
              'data-title': 'Actions',
            },
          };
        }}
      />
    </Table>
  );
}
