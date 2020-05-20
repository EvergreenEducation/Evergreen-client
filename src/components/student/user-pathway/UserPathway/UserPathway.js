import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Tag, Button, Input, Form } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faTimes,
  faEdit,
  faCheck,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { LearnAndEarnIcons } from 'components/shared';
import './user-pathway.scss';
import 'assets/scss/antd-overrides.scss';

const { TextArea } = Input;

export default function ({ children, data = {}, session = {} }) {
  const [openNotes, setOpenNotes] = useState(false);
  const {
    cost,
    credit,
    pay,
    DataFields = [],
    Provider,
    provider_id,
    name,
  } = data;

  const [form] = Form.useForm();

  const topics = DataFields.filter((d) => d.type === 'topic');
  let { start_date } = data;
  start_date = dayjs(start_date).format('MMM DD, YYYY');

  return (
    <div className="infoLayout">
      <header className="mx-auto relative" style={{ minHeight: 52 }}>
        <span
          className="block text-white text-center text-lg absolute text-white w-full bottom-0 p-3"
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
          }}
        >
          {name || '---'}
        </span>
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
            {Provider && Provider.name ? (
              <Link
                className={provider_id ? '' : 'pointer-events-none'}
                to={`/home/provider/${provider_id}`}
              >
                {Provider.name}
              </Link>
            ) : null}
          </Col>
          <Col span={12} className="flex flex-row-reverse items-center">
            {Provider && Provider.location && (
              <span className="block ml-1">{Provider.location}</span>
            )}
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
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
            <span>{start_date || '---'}</span>
          </Col>
          <Col span={12} className="flex flex-row items-center"></Col>
        </Row>
        <hr />
        <Col span={24} className="mt-2">
          <Row className="justify-between items-center">
            <span className="blockmy-auto">Notes:</span>
            {!openNotes && (
              <Button
                className="pl-2 rounded"
                type="primary"
                size="small"
                shape="circle"
                onClick={() => setOpenNotes(true)}
                icon={
                  <FontAwesomeIcon
                    className="relative"
                    style={{ left: 1 }}
                    icon={faEdit}
                  />
                }
              />
            )}
            {openNotes && (
              <div>
                <Button
                  className="px-2 rounded mr-1"
                  type="primary"
                  size="small"
                  shape="circle"
                  icon={<FontAwesomeIcon icon={faCheck} />}
                />
                <Button
                  className="px-2 rounded"
                  type="default"
                  size="small"
                  danger
                  shape="circle"
                  onClick={() => setOpenNotes(false)}
                  icon={<FontAwesomeIcon icon={faTimes} />}
                />
              </div>
            )}
          </Row>
          {openNotes && (
            <Form form={form} className="mt-2">
              <Form.Item>
                <TextArea className="rounded shadow-inner" />
              </Form.Item>
            </Form>
          )}
        </Col>
      </section>
      <section>{children}</section>
    </div>
  );
}
