import React from 'react';
import { Table, Tag, Button } from 'antd';
import { find, matchesProperty, isNil } from 'lodash';
import 'assets/scss/antd-overrides.scss';

const { Column } = Table;

function ProvidersTable({ data = [], loading, handleUpdateModal }) {
  return (
    <Table
      loading={loading}
      pagination={{ pageSize: 8 }}
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
        render={(text, record) => {
          let children = 'N/A';
          if (text && text.length) {
            children = text;
          }
          return {
            children,
            props: {
              'data-title': 'Name',
            },
          };
        }}
      />
      <Column
        className="antd-col"
        title="Location"
        dataIndex="location"
        key="location"
        render={(text, record) => {
          let children = 'N/A';
          if (text && text.length) {
            children = text;
          }
          return {
            children,
            props: {
              'data-title': 'Location',
            },
          };
        }}
      />
      <Column
        className="antd-col"
        title="Industry"
        dataIndex="industry"
        key="industry"
        render={(text, record) => {
          let children = 'N/A';
          if (text && text.length) {
            children = text;
          }
          return {
            children,
            props: {
              'data-title': 'Industry',
            },
          };
        }}
      />
      <Column
        className="antd-col"
        title="Topics"
        dataIndex="DataFields"
        key="DataFields"
        render={(datafields = [], record) => {
          datafields = datafields.filter((d) => d.type === 'topic');
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
                }) || null}
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
        title="Type"
        dataIndex="DataFields"
        key="DataFields"
        render={(datafields = [], record) => {
          const datafield = find(
            datafields,
            matchesProperty('type', 'provider')
          );
          let children = 'N/A';
          if (!isNil(datafield)) {
            children = datafield.name;
          }
          return {
            children: children,
            props: {
              'data-title': 'Type',
            },
          };
        }}
      />
      <Column
        className="antd-col"
        title=""
        key="update"
        render={(text, record) => ({
          children: (
            <Button type="link" onClick={() => handleUpdateModal(record)}>
              Update
            </Button>
          ),
          props: {
            'data-title': '',
          },
        })}
      />
    </Table>
  );
}

export default ProvidersTable;
