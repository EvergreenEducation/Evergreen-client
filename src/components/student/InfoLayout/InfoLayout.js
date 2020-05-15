import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Tag, Button, Input, Form, message } from 'antd';
import { find, last } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faCalendarAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { faHandshake } from '@fortawesome/free-regular-svg-icons';
import { reactLocalStorage } from 'reactjs-localstorage';
import dayjs from 'dayjs';
import axiosInstance from 'services/AxiosInstance';
import { LearnAndEarnIcons, UnitTag } from 'components/shared';
import './info-layout.scss';
import 'assets/scss/antd-overrides.scss';

export default function ({
  children,
  type = 'offer',
  data = {},
  groupedDataFields,
  session = {},
}) {
  const [openCodeInput, setOpenCodeInput] = useState(false);
  const {
    id,
    cost,
    credit,
    pay,
    length,
    length_unit,
    frequency,
    frequency_unit,
    DataFields = [],
    Provider = { name: null, location: null },
    provider_id,
    name,
    is_public,
    industry,
    financial_aid,
    location,
  } = data;

  const [form] = Form.useForm();

  const enrollOffer = async () => {
    const studentId = session.student_id;
    const offerId = id;
    try {
      const response = await axiosInstance.put(
        `/students/${studentId}/offers/${offerId}/provider/${provider_id}/enroll`
      );
      if (response.status === 200) {
        message.success(`You've enrolled in ${data.name}`);
      }
      if (response.status === 201) {
        message.info(
          `You've enrolled in ${data.name}. We will notify the provider`
        );
      }
      return response;
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const enrollPathway = async () => {
    const studentId = session.student_id;
    const pathwayId = id;
    try {
      const response = await axiosInstance.post(
        `/students/${studentId}/pathways/${pathwayId}/enroll`
      );
      if (response.status === 200) {
        message.info(`You're already enrolled in ${data.name}`);
      }
      if (response.status === 201) {
        message.success(`You've enrolled in ${data.name}`);
      }
      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  };

  const onEnroll = () => {
    if (!Object.keys(session).length) {
      if (type === 'offer') {
        reactLocalStorage.set('offer_id', id);
      }
      if (type === 'pathway') {
        reactLocalStorage.set('pathway_id', id);
      }
      return window.location.replace(`${process.env.REACT_APP_API_URL}/login`);
    }
    if (
      type === 'offer' &&
      Object.keys(session).length &&
      session.role === 'student'
    ) {
      return enrollOffer();
    }
    if (
      type === 'pathway' &&
      Object.keys(session).length &&
      session.role === 'student'
    ) {
      return enrollPathway();
    }
  };

  const topics = DataFields.filter((d) => d.type === 'topic');
  const offerCategory = find(DataFields, ['type', 'offer_category']);
  let { start_date } = data;
  start_date = dayjs(start_date).format('MMM DD, YYYY');
  const lengthUnit = find(groupedDataFields.length_unit, ({ id }) => {
    return id === Number(length_unit);
  });
  const frequencyUnit = find(groupedDataFields.frequency_unit, ({ id }) => {
    return id === Number(frequency_unit);
  });

  let src = null;
  let alt = '';

  if (data && data.Files && data.Files.length) {
    const { file_link, location: fileLocation } = last(data.Files);
    src = file_link;
    alt = fileLocation;
  }

  return (
    <div className="infoLayout">
      <header className="mx-auto relative" style={{ minHeight: 52 }}>
        <span
          className="block text-white text-center text-lg absolute text-white w-full bottom-0 p-3"
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            borderTopLeftRadius: !src ? '1rem' : 'none',
            borderTopRightRadius: !src ? '1rem' : 'none',
          }}
        >
          {name || '---'}
        </span>
        {src && (
          <figure className="mx-auto">
            <img className="h-full w-full object-cover" src={src} alt={alt} />
          </figure>
        )}
      </header>
      <section
        className="bg-white px-2 pb-4"
        style={{
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem',
        }}
      >
        <Row className="py-2">
          <Col span={12}>
            {type === 'provider' ? (
              <span>{industry}</span>
            ) : provider_id ? (
              <Link
                className={provider_id ? '' : 'pointer-events-none'}
                to={`/home/provider/${provider_id}`}
              >
                {Provider.name}
              </Link>
            ) : null}
          </Col>
          <Col span={12} className="flex flex-row-reverse items-center">
            <span className="block ml-1">
              {type === 'provider' && Provider
                ? Provider.location || null
                : null}
              {type !== 'provider' ? location || null : null}
            </span>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </Col>
        </Row>
        <hr />
        <Row className="py-2">
          <Col span={12} className="flex items-center">
            <LearnAndEarnIcons learnAndEarn={data.learn_and_earn} />
          </Col>
          <Col span={12} className="flex flex-col items-right text-right">
            <span className="text-gray-600">TOPICS</span>
            <div className="flex flex-row-reverse flex-wrap items-right">
              {topics.map((t, index) => {
                if (t.type !== 'topic') {
                  return null;
                }
                return (
                  <Tag
                    className="mr-0 ml-1 mb-1"
                    color={index % 2 ? 'blue' : 'orange'}
                    key={index.toString()}
                  >
                    {t.name}
                  </Tag>
                );
              })}
            </div>
          </Col>
        </Row>
        <hr />
        <Row className="mt-2 mb-1">
          <Col span={8}>Cost : {cost ? `$${cost}` : '---'}</Col>
          <Col span={8} className="flex justify-center">
            Credit : {credit ? `$${credit}` : '---'}
          </Col>
          <Col span={8} className="flex flex-row-reverse">
            Pay : {pay ? `$${pay}` : '---'}
          </Col>
        </Row>
        <Row className="mt-1 mb-2">
          <Col span={12} className="flex flex-row items-center">
            {type !== 'provider' && length && (
              <UnitTag number={length} unit={lengthUnit} />
            )}
            {type !== 'provider' && frequency && (
              <UnitTag number={frequency} unit={frequencyUnit} />
            )}
            {type === 'provider' && (
              <>
                <FontAwesomeIcon icon={faHandshake} className="mr-1" />
                <span>{financial_aid}</span>
              </>
            )}
          </Col>
          <Col span={12} className="flex flex-row-reverse items-center">
            {type === 'provider' ? (
              <Tag className="mr-0" color="purple">
                {is_public ? 'Public' : 'Private'}
              </Tag>
            ) : (
              <>
                <span className="ml-1">{start_date || '---'}</span>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </>
            )}
          </Col>
        </Row>
        <hr />
        <section className="flex flex-col justify-center">
          <p className="text-center">{data.description}</p>
          {type === 'offer' && (
            <Tag className="mx-auto">
              {offerCategory ? offerCategory.name : null}
            </Tag>
          )}
        </section>
        {type === 'pathway' && (
          <Button
            type="primary"
            className="w-1/2 rounded mx-auto block mt-2"
            onClick={onEnroll}
          >
            Enroll
          </Button>
        )}
        {type === 'offer' && (
          <Form form={form}>
            <Row className="flex-col mt-2 justify-center items-center">
              <Button
                type="primary"
                className="w-1/2 rounded"
                onClick={() => onEnroll()}
              >
                Enroll
              </Button>
              {openCodeInput && (
                <Row className={`w-1/2 ${openCodeInput ? 'mt-2' : ''}`}>
                  <Col span={20}>
                    <Form.Item
                      name="activation_code"
                      rules={[
                        {
                          required: true,
                          message: 'Requires code',
                        },
                      ]}
                    >
                      <Input
                        className="flex items-center rounded-l rounded-r-none ant-input-group-add-on-border-none-p-0"
                        style={{ paddingBottom: 4.5, zIndex: 2 }}
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button
                      className={`rounded-l-none rounded-r`}
                      onClick={() => setOpenCodeInput(false)}
                      icon={<FontAwesomeIcon icon={faTimes} />}
                    />
                  </Col>
                </Row>
              )}
              {!openCodeInput && (
                <Button
                  type="link"
                  onClick={() => setOpenCodeInput(!openCodeInput)}
                >
                  Already have code?
                </Button>
              )}
            </Row>
          </Form>
        )}
      </section>
      <section>{children}</section>
    </div>
  );
}
