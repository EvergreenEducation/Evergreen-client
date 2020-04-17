import React from 'react';
import {
    Form, Select, Table, Popconfirm, Input, Button
} from 'antd';
import 'scss/antd-overrides.scss';
import OfferStore from 'store/Offer';
import PathWayStore from 'store/Pathway';

const { Option } = Select;
const { Column } = Table;

function OfferOptions() {
  const Store = OfferStore.useContainer();
  const { entities = {} } = Store;
  const offers = Object.values(entities);

  return offers.map(( offer ) => 
      <Option
        value={offer.id}
        key={offer.id}
      >
        {offer.name}
      </Option>
  );
}

export default function ({ pathway }) {
  console.log(pathway);
  const pathwayStore = PathWayStore.useContainer();
  const removeOffer = async () => {

  }

  const updateOffer = async () => {

  }

  return (
    <>
      <Input
          className="w-full rounded-l rounded-r-none ant-input-group-add-on-border-none-p-0"
          style={{ width: "400px", marginBottom: "3px" }}
          placeholder="Group Name"
          name="add-group"
          onChange={() => {}}
          addonAfter={
              <Button
                  className="rounded-l-none"
                  type="primary"
                  onClick={() => {}}
              >
                  Add Group
              </Button>
          }
      />
      <Table
          dataSource={[]}
          bordered
          className="ant-table-wrapper--responsive w-full"
          rowClassName={() => "antd-row"}
          rowKey="id"
      >
          <Column
              className="antd-col"
              title="Offer Group"
              dataIndex="group_name"
              key="group_name"
              render={(text, record) => ({
                  children: text,
                  props: {
                      "data-title": "Offer Group",
                  }
              })}
          />
          <Column
              className="antd-col"
              title="Offers"
              dataIndex="inputName"
              key="inputName"
              render={(inputName, record) => {
                  return {
                      children: (
                          <Form.Item
                              className="my-auto"
                              name={inputName}
                          >
                              <Select
                                  className="w-full rounded custom-select-rounded-tr-none"
                                  showSearch
                                  mode="multiple"
                              >
                                <OfferOptions />
                              </Select>
                          </Form.Item>
                      ),
                      props: {
                          "data-title": "Offers",
                      }
                  }
              }}
          />
          <Column
              className="antd-col"
              title=""
              key="index"
              render={(text, record) => ({
                  children: (
                      <Popconfirm
                          className="text-red-500 cursor-pointer"
                          title="Are you sure you want to delete this group?"
                          onConfirm={() => removeOffer(record)}
                          okText="Yes"
                          cancelText="No"
                      >
                          Remove
                      </Popconfirm>
                  ),
                  props: {
                      "data-title": "",
                  }
              })}
          />
      </Table>
    </>
  )
}
