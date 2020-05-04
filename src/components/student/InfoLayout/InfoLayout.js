import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Tag } from 'antd';
import { find, last } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faHandshake } from '@fortawesome/free-regular-svg-icons';
import { LearnAndEarnIcons } from 'components/shared';
import dayjs from 'dayjs';
import './info-layout.scss';

export default function ({
  children,
  type = 'offer',
  data = {},
  groupedDataFields,
}) {
  const {
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
    <div style={{ width: 423 }}>
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
            ) : (
              <Link
                className={provider_id ? '' : 'pointer-events-none'}
                to={`/home/provider/${provider_id}`}
              >
                {Provider.name}
              </Link>
            )}
          </Col>
          <Col span={12} className="flex flex-row-reverse items-center">
            <span className="block ml-1">
              {type === 'provider' ? location || '-' : Provider.location || '-'}
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
              <div className="unit-tag mr-2 text-white rounded px-1">
                {Number(length)} {lengthUnit.name || ''}
              </div>
            )}
            {type !== 'provider' && frequency && (
              <div className="unit-tag text-white rounded px-1">
                {Number(frequency)} {frequencyUnit.name}
              </div>
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
      </section>
      <section>{children}</section>
    </div>
  );
}