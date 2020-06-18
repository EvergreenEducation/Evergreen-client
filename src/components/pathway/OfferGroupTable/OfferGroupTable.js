import React, { Component } from 'react';
import { Button, Input, message } from 'antd';
import {
  each,
  groupBy,
  find,
  findIndex,
  sortBy,
  indexOf,
  flowRight,
} from 'lodash';
import GroupTable from './GroupTable';
import 'assets/scss/antd-overrides.scss';

function getExistingOffers(pathway) {
  let offers = [];
  let groups = groupBy(pathway.GroupsOfOffers, 'group_name');
  each(groups, (offerInTheGroup, group_name) => {
    offers.push({
      group_name: group_name,
      offers: offerInTheGroup,
      removed: false,
    });
  });

  return offers;
}

class OfferGroupTable extends Component {
  state = {
    groupNameField: '',
    groupNames: [],
    groupsData: [],
  };

  addGroupHandler = () => {
    const { groupsOfOffers, setGroupsOfOffers } = this.props;
    const exist = find(groupsOfOffers, [
      'group_name',
      this.state.groupNameField,
    ]);
    if (exist) {
      message.error('Group already exist');
      return;
    }
    setGroupsOfOffers([
      ...groupsOfOffers,
      { group_name: this.state.groupNameField, offers: [], removed: false },
    ]);
  };

  removeGroupHandler = (groupName) => {
    const { groupsOfOffers, setGroupsOfOffers } = this.props;
    groupsOfOffers.forEach((group) => {
      if (group.group_name === groupName) {
        group.removed = true;
      }
    });
    setGroupsOfOffers([...groupsOfOffers]);
  };

  updateGroupHandler = (groupName, selectedValues) => {
    const { groupsOfOffers, setGroupsOfOffers } = this.props;
    let currentOffers = [...groupsOfOffers];
    let offerIndex = findIndex(currentOffers, ['group_name', groupName]);
    currentOffers[offerIndex].offers = selectedValues.map((sv) => ({
      offer_id: sv,
    }));
    setGroupsOfOffers(currentOffers);
  };

  setGroupNameField = (e) => {
    if (e.target.value && e.target.value.length) {
      this.setState({ ...this.state, groupNameField: e.target.value });
    }
  };

  onChangeAlsoValidate = (inputVal) => {
    const { form } = this.props;
    const { groupNames } = this.state;
    form.validateFields(groupNames);
    return inputVal;
  };

  componentDidUpdate(nextProps) {
    const { pathway, groupsOfOffers, setGroupsOfOffers } = this.props;
    if (pathway !== nextProps.pathway) {
      nextProps.setGroupsOfOffers();
      const existingOffers = getExistingOffers(pathway);
      setGroupsOfOffers(existingOffers);
      return true;
    }
    if (groupsOfOffers !== nextProps.groupsOfOffers) {
      let groupsData = groupsOfOffers
        ? groupsOfOffers.filter((item) => !item.removed)
        : [];

      if (pathway && pathway.group_sort_order) {
        groupsData = flowRight([
          (d) => sortBy(d, ['year']),
          (d) =>
            d.map((g) => {
              this.state.groupNames.push(g.group_name);
              const year = indexOf(pathway.group_sort_order, g.group_name) + 1;
              return {
                ...g,
                year,
              };
            }),
        ])(groupsData);
      }

      this.setState({ ...this.state, groupsData });
      return true;
    }
    return false;
  }

  render() {
    const { pathway, offerStore } = this.props;

    return (
      <div className="w-full">
        <Input
          className="w-full rounded-l rounded-r-none ant-input-group-add-on-border-none-p-0"
          style={{ width: '400px', marginBottom: '3px' }}
          placeholder="Group Name"
          name="add-group"
          onChange={this.setGroupNameField}
          addonAfter={
            <Button
              className="rounded-l-none"
              type="primary"
              onClick={this.addGroupHandler}
            >
              Add Group
            </Button>
          }
        />
        <GroupTable
          groupsData={this.state.groupsData}
          offerStore={offerStore}
          onChangeAlsoValidate={this.onChangeAlsoValidate}
          pathway={pathway}
          updateGroupHandler={this.updateGroupHandler}
          removeGroupHandler={this.removeGroupHandler}
        />
      </div>
    );
  }
}

export default OfferGroupTable;
