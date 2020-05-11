import React from 'react';
import {
  Layout,
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  Checkbox,
} from 'antd';
import { TitleDivider } from 'components/shared';
import { ImageUploadAndNameInputs } from 'components/shared';
import { groupBy, property, isNil, compact } from 'lodash';
import 'assets/scss/antd-overrides.scss';
import OfferGroupTable from './OfferGroupTable';

const { Option } = Select;

const preloadOptions = (data = []) =>
  data.map((item, index) => {
    return (
      <Option value={item.id} key={index.toString()}>
        {item.name}
      </Option>
    );
  });

export default function PathwayForm({
  datafields = [],
  groupsOfOffers = [],
  setGroupsOfOffers,
  userId = null,
  file,
  onChangeUpload,
  pathway,
  providers,
  role,
}) {
  providers = compact(providers);
  datafields = Object.values(datafields);

  const grouped = groupBy(datafields, property('type'));
  const {
    payment_unit = [],
    length_unit = [],
    credit_unit = [],
    topic = [],
    frequency_unit = [],
  } = grouped;

  return (
    <Layout>
      <ImageUploadAndNameInputs
        className="mb-2"
        userId={userId}
        onChangeUpload={onChangeUpload}
        file={file}
      >
        <Form.Item
          label="Description"
          name="description"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit"
          rules={[{ required: true, message: 'Please fill in this field' }]}
        >
          <Input.TextArea className="rounded" rows={2} />
        </Form.Item>
        <Row gutter={8}>
          <Col span={10}>
            <Form.Item
              label="Start Date"
              name="start_date"
              labelAlign={'left'}
              colon={false}
              className="mb-0 inherit"
            >
              <DatePicker
                className="w-full custom-datepicker rounded"
                placeholder=""
              />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item
              label="Keywords"
              name="keywords"
              labelAlign={'left'}
              colon={false}
              className="mb-0 inherit"
            >
              <Input className="rounded" />
            </Form.Item>
          </Col>
        </Row>
      </ImageUploadAndNameInputs>
      <TitleDivider title={'Add Offers Group'} />
      <Row>
        <OfferGroupTable
          pathway={pathway}
          groupsOfOffers={groupsOfOffers}
          setGroupsOfOffers={setGroupsOfOffers}
        />
        <div
          className="w-full mb-4"
          style={{
            backgroundColor: '#e2e8f0',
            height: '1px',
          }}
        />
      </Row>
      <Row className="items-center mb-0">
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          Topics
        </span>
        <Form.Item name="topics" className="w-full">
          <Select showSearch className="w-full custom-select" mode="multiple">
            {!isNil(topic) && topic.length ? preloadOptions(topic) : null}
          </Select>
        </Form.Item>
      </Row>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Learn/Earn"
            name="learn_and_earn"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select className="rounded custom-select">
              <Option value="learn">Learn</Option>
              <Option value="earn">Earn</Option>
              <Option value="both">Learn and Earn</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Generic Type"
            name="type"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please fill in this field' }]}
          >
            <Input className="rounded" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Earnings"
            name="earnings"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <Input className="rounded" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Length"
            name="length"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please fill in this field' }]}
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Length Unit"
            name="length_unit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select className="rounded custom-select">
              {!isNil(length_unit) && length_unit.length
                ? preloadOptions(length_unit)
                : null}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Frequency"
            name="frequency"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Frequency Unit"
            name="frequency_unit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <Select className="rounded custom-select">
              {!isNil(frequency_unit) && frequency_unit.length
                ? preloadOptions(frequency_unit)
                : null}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Credit"
            name="credit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please fill in this field' }]}
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Credit Unit"
            name="credit_unit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select className="rounded custom-select">
              {!isNil(credit_unit) && credit_unit.length
                ? preloadOptions(credit_unit)
                : null}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Pay"
            name="pay"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please fill in this field' }]}
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Pay Unit"
            name="pay_unit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select className="rounded custom-select">
              {!isNil(payment_unit) && payment_unit.length
                ? preloadOptions(payment_unit)
                : null}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            label="Outlook"
            name="outlook"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <Input className="rounded" />
          </Form.Item>
        </Col>
        <Col span={12} className={role === 'provider' ? 'hidden' : ''}>
          <Form.Item
            label="Provider"
            name="provider_id"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit flex-col w-full"
          >
            <Select
              className={`custom-select-rounded-l-r-none`}
              showSearch
              name="provider_id"
            >
              {!isNil(providers) && providers.length
                ? preloadOptions(providers)
                : null}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {(role === 'admin' && (
        <Row className="w-full">
          <Col xs={24} sm={24} md={6}>
            <Form.Item
              name="is_local_promo"
              labelAlign={'left'}
              colon={false}
              className="mt-2 mb-0 inherit"
              valuePropName="checked"
            >
              <Checkbox defaultChecked={false}>Local Promo</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Form.Item
              name="is_main_promo"
              labelAlign={'left'}
              colon={false}
              className="mt-2 mb-0 inherit"
              valuePropName="checked"
            >
              <Checkbox defaultChecked={false}>Main Promo</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      )) ||
        null}
    </Layout>
  );
}
