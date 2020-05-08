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
} from 'antd';
import { ImageUploadAndNameInputs } from 'components/shared';
import { groupBy, property, isNil, remove, compact } from 'lodash';
import 'assets/scss/antd-overrides.scss';

const { Option } = Select;

const preloadOptions = (data = []) =>
  data.map((item, index) => {
    return (
      <Option value={item.id} key={index.toString()}>
        {item.name}
      </Option>
    );
  });

export default function OfferForm({
  datafields = [],
  providers = {},
  offers = [],
  offer = {},
  onChangeUpload,
  file,
  userId = null,
  role,
}) {
  providers = compact(providers);
  datafields = Object.values(datafields);

  const grouped = groupBy(datafields, property('type'));
  const {
    offer_category = [],
    part_of_day_unit = [],
    payment_unit = [],
    length_unit = [],
    credit_unit = [],
    topic = [],
    frequency_unit = [],
    cost_unit = [],
  } = grouped;

  let offerOptions = null;

  if (!isNil(offers) && offers.length) {
    const updatedOffers = remove(offers, (o) => {
      return !(o.id === offer.id);
    });
    offerOptions = preloadOptions(updatedOffers);
  }

  return (
    <Layout>
      <ImageUploadAndNameInputs
        className="mb-2"
        userId={userId}
        onChangeUpload={onChangeUpload}
        file={file}
      >
        <Row gutter={8}>
          <Col
            className={role === 'provider' ? 'hidden' : ''}
            xs={24}
            sm={24}
            md={15}
          >
            <div className="flex flex-row">
              <Form.Item
                label="Provider"
                name="provider_id"
                labelAlign={'left'}
                colon={false}
                className="mb-0 inherit flex-col w-full"
              >
                <Select
                  className="custom-select-rounded-l-r-none"
                  showSearch
                  name="provider_id"
                >
                  {!isNil(providers) && providers.length
                    ? preloadOptions(providers)
                    : null}
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col span={9} xs={24} sm={24} md={role === 'provider' ? 10 : 9}>
            <Form.Item
              label="Generic Offer"
              name="category"
              labelAlign={'left'}
              colon={false}
              className="mb-0 inherit"
              rules={[
                { required: true, message: 'Please select a generic offer' },
              ]}
            >
              <Select className="rounded custom-select" name="category">
                {!isNil(offer_category) && offer_category.length
                  ? preloadOptions(offer_category)
                  : null}
              </Select>
            </Form.Item>
          </Col>
        </Row>
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
                format="MM-DD-YYYY"
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
      <Col>
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          Description
        </span>
        <Form.Item
          name="description"
          labelAlign={'left'}
          colon={false}
          className="inherit"
          rules={[{ required: true, message: 'Please provide a description' }]}
        >
          <Input.TextArea rows={4} className="rounded" />
        </Form.Item>
      </Col>
      <Row className="items-center mb-0">
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          Related Offers
        </span>
        <Form.Item name="related_offers" className="w-full">
          <Select
            className="w-full rounded custom-select"
            showSearch
            mode="multiple"
          >
            {offerOptions}
          </Select>
        </Form.Item>
      </Row>
      <Row className="items-center mb-0">
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          Prerequisites
        </span>
        <Form.Item name="prerequisites" className="w-full">
          <Select
            className="w-full rounded custom-select"
            showSearch
            mode="multiple"
          >
            {offerOptions}
          </Select>
        </Form.Item>
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
            label="Day &#38; Time"
            name="part_of_day"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select className="rounded custom-select">
              {!isNil(part_of_day_unit) && part_of_day_unit.length
                ? preloadOptions(part_of_day_unit)
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
            rules={[{ required: true, message: 'Please fill in this field' }]}
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
            rules={[{ required: true, message: 'Please select an option' }]}
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
            label="Cost"
            name="cost"
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
            label="Cost Unit"
            name="cost_unit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <Select className="rounded custom-select">
              {!isNil(cost_unit) && cost_unit.length
                ? preloadOptions(cost_unit)
                : null}
            </Select>
          </Form.Item>
        </Col>
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
      </Row>
      <Row gutter={8}>
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
      </Row>
    </Layout>
  );
}
