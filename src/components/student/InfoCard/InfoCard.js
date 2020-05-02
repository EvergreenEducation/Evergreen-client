import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { find } from 'lodash';
import dayjs from 'dayjs';
import { LearnAndEarnIcons } from 'components/shared';
import './info-card.scss';

export default function ({
  data,
  provider,
  groupedDataFields,
  style,
  className,
  actions = [],
}) {
  if (!data) {
    return null;
  }
  let {
    name,
    learn_and_earn,
    cost,
    pay,
    credit,
    length_unit,
    frequency_unit,
    length,
    frequency,
    provider_id,
    start_date,
  } = data;
  if (start_date) {
    start_date = dayjs(start_date).format('MMM DD, YYYY');
  }
  const { name: providerName, location } = provider;
  const lengthUnit = find(groupedDataFields.length_unit, ({ id }) => {
    return id === Number(length_unit);
  });
  const frequencyUnit = find(groupedDataFields.frequency_unit, ({ id }) => {
    return id === Number(frequency_unit);
  });

  return (
    <Card
      title={name || ''}
      className={`info-card ${className}`}
      style={style}
      actions={actions}
    >
      <Row>
        <Col span={12}>
          <Row>
            <Link
              className={provider_id ? '' : 'pointer-events-none'}
              to={`/provider/${provider_id}`}
            >
              {providerName}
            </Link>
          </Row>
          <Row>
            <LearnAndEarnIcons learnAndEarn={learn_and_earn} />
          </Row>
          <Row>
            <div>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {location || '-'}
            </div>
          </Row>
          <Row>
            {length && (
              <div className="unit-tag mr-2 text-white rounded px-1">
                {Number(length)} {lengthUnit.name}
              </div>
            )}
            {frequency && (
              <div className="unit-tag text-white rounded px-1">
                {Number(frequency)} {frequencyUnit.name}
              </div>
            )}
          </Row>
        </Col>
        <Col span={12} className="text-right">
          <ol>
            <li>Cost : {`$${Number(cost) || '---'}`}</li>
            <li>Pay : {`$${Number(pay) || '---'}`}</li>
            <li>Credit : {`$${Number(credit) || '---'}`}</li>
            <li>
              {' '}
              <FontAwesomeIcon icon={faCalendarAlt} /> {start_date || '---'}
            </li>
          </ol>
        </Col>
      </Row>
    </Card>
  );
}
