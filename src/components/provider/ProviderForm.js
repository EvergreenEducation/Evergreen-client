import React, { useEffect } from 'react';
import {
  Layout,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Select,
  Checkbox,
} from 'antd';
import { ImageUploadAndNameInputs } from 'components/shared';
import { groupBy, isNil } from 'lodash';
import 'assets/scss/antd-overrides.scss';

const { Option } = Select;

const ProviderForm = (props) => {
  const { datafields = [], userId = null, onChangeUpload, file, role } = props;

  useEffect(() => {}, [props.datafields, file]);

  const groupedDataFields = groupBy(datafields, 'type') || [];
  let { topic = [], provider = [] } = groupedDataFields;

  let providerTypeOptions = null;

  if (!isNil(provider) && provider.length) {
    providerTypeOptions = provider.map(({ name, id }, index) => {
      return (
        <Option value={id} key={index.toString()}>
          {name}
        </Option>
      );
    });
  }

  let topicOptions = null;

  if (!isNil(topic) && topic.length) {
    topicOptions = topic.map(({ name, id }, index) => (
      <Option value={id} key={index.toString()}>
        {name}
      </Option>
    ));
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
          <Col xs={24} sm={24} md={18}>
            <Form.Item
              label="Location"
              name="location"
              labelAlign={'left'}
              colon={false}
              className="mb-0 inherit"
              rules={[{ required: true, message: 'Please enter a location' }]}
            >
              <Input name="location" className="rounded" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Form.Item
              label="Type"
              name="type"
              labelAlign={'left'}
              colon={false}
              className="mb-0 inherit"
              rules={[{ required: true, message: 'Please select a type' }]}
            >
              <Select
                name="type"
                className="rounded custom-select"
                notFoundContent="No options available. Please create a provider type in settings."
              >
                {providerTypeOptions}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              label="Learn/Earn"
              name="learn_and_earn"
              labelAlign={'left'}
              colon={false}
              className="mb-0 inherit"
              rules={[{ required: true, message: 'Please select an option' }]}
            >
              <Select name="learn_and_earn" className="custom-select">
                <Option value="learn">Learn</Option>
                <Option value="earn">Earn</Option>
                <Option value="both">Learn and Earn</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              label="Public/Private"
              name="is_public"
              labelAlign={'left'}
              colon={false}
              className="mb-0 inherit"
              rules={[{ required: true, message: 'Please select an option' }]}
            >
              <Select name="is_public" className="custom-select">
                <Option value={true}>Public</Option>
                <Option value={false}>Private</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              label="Industry"
              name="industry"
              labelAlign={'left'}
              colon={false}
              className="mb-0 inherit"
            >
              <Input name="industry" className="rounded" />
            </Form.Item>
          </Col>
        </Row>
      </ImageUploadAndNameInputs>
      <Col span={24}>
        <Form.Item
          label="Description"
          name="description"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit"
        >
          <Input className="rounded" />
        </Form.Item>
      </Col>
      <Col span={24}>
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
      <Row className="items-center mb-0 mt-2">
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          Topics
        </span>
        <Form.Item name="topics" className="w-full">
          <Select showSearch className="w-full custom-select" mode="multiple">
            {topicOptions}
          </Select>
        </Form.Item>
      </Row>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Financial Aid"
            name="financial_aid"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <Input className="rounded" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={4}>
          <Form.Item
            label="Cost"
            name="cost"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={4}>
          <Form.Item
            label="Pay"
            name="pay"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={4}>
          <Form.Item
            label="Credit"
            name="credit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>
      </Row>
      <Col span={24}>
        <Form.Item
          label="News"
          name="news"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit"
        >
          <Input className="rounded" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Contact"
          name="contact"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit"
        >
          <Input className="rounded" />
        </Form.Item>
      </Col>
      <Col className="mt-2 mb-0">
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          External URL
        </span>
        <Form.Item
          name="external_url"
          labelAlign={'left'}
          colon={false}
          className="inherit mb-0"
        >
          <Input className="rounded" />
        </Form.Item>
      </Col>
      {(role === 'admin' && (
        <Row className="w-full relative" style={{ left: '0.4em' }}>
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
};

export default ProviderForm;
