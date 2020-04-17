import React, { useState, useEffect } from 'react';
import {
    Form, Select, Table, Popconfirm, Input, Button
} from 'antd';
import 'scss/antd-overrides.scss';
import OfferStore from 'store/Offer';
import { each, groupBy, map, find, findIndex } from 'lodash';

const { Option } = Select;
const { Column } = Table;

function getOfferOptions({ existingOffers = [] }) {
  const Store = OfferStore.useContainer();
  const { entities = {} } = Store;
  const offers = Object.values(entities);

  const allOptions = offers.map(( offer ) => 
      <Option
        value={offer.id}
        key={offer.id}
      >
        {offer.name}
      </Option>
  );

  const defaultValues = map(existingOffers, (o) => {
    return o.offer_id;
  })

  return { allOptions, defaultValues };
}

function getExistingOffers(pathway) {
  let offers = [];
  let groups = groupBy(pathway.GroupsOfOffers, 'group_name');
  each(groups, (offerInTheGroup, group_name) => {
    offers.push({
      group_name: group_name,
      offers: offerInTheGroup,
      removed: false
    })
  });

  // not efficient but for render table shake
  return offers;
}

export default function ({ pathway, groupsOfOffers, setGroupsOfOffers }) {
  const [ groupNameField, setGroupNameField ] = useState("");

  useEffect(() => {
    if (pathway && pathway.GroupsOfOffers) {
      setGroupsOfOffers(getExistingOffers(pathway));
    }
  }, [pathway])

  let addGroupHandler = () => {
      const exist = find(groupsOfOffers, ['group_name', groupNameField]);
      if (exist) {
        alert('Group already exist');
        return;
      }
      setGroupsOfOffers([...groupsOfOffers, { group_name: groupNameField, offers: [], removed: false }])
    }

  let removeGroupHandler =  (groupName) => {
    groupsOfOffers.forEach(group => {
      if (group.group_name === groupName) {
        group.removed = true;
      }
    })
    setGroupsOfOffers([...groupsOfOffers]);
  };

  let updateGroupHandler = (groupName, selectedValues) => {
    let currentOffers = [...groupsOfOffers]; // immutable
    let offerIndex = findIndex(currentOffers, ['group_name', groupName]);
    currentOffers[offerIndex].offers = selectedValues.map(sv => ({ offer_id: sv })); //mimic same payload to send to server
    setGroupsOfOffers(currentOffers);
  }

  let renderData = groupsOfOffers.filter(item => !item.removed);

  return (
    <>
      <Input
          className="w-full rounded-l rounded-r-none ant-input-group-add-on-border-none-p-0"
          style={{ width: "400px", marginBottom: "3px" }}
          placeholder="Group Name"
          name="add-group"
          onChange={(e) => setGroupNameField(e.target.value)}
          addonAfter={
              <Button
                  className="rounded-l-none"
                  type="primary"
                  onClick={addGroupHandler}
              >
                  Add Group
              </Button>
          }
      />
      <Table
          dataSource={renderData}
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
                  const { defaultValues, allOptions } = getOfferOptions({ existingOffers: record.offers })
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
                                defaultValue={defaultValues}
                                onChange={(value) => updateGroupHandler(record.group_name, value)}
                              >
                                {allOptions}
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
                          onConfirm={() => removeGroupHandler(record.group_name)}
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
