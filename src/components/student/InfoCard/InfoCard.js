import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { find } from 'lodash';
import dayjs from 'dayjs';
import { LearnAndEarnIcons } from 'components/shared';
import './info-card.scss';

export default function ({
  data,
  provider = {},
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
  const lengthUnit = find(groupedDataFields.length_unit, ({ id }) => {
    return id === Number(length_unit);
  });
  const frequencyUnit = find(groupedDataFields.frequency_unit, ({ id }) => {
    return id === Number(frequency_unit);
  });

  return (
    <Card className={`info-card shadow ${className}`} style={style}>
      <Row>
        <Col span={12}>
          <Row className="mb-1 flex-col">
            <span className="text-left font-bold">{name}</span>
            <Link
              className={`text-xs font-normal text-left ${
                provider_id ? '' : 'pointer-events-none'
              }`}
              to={`/home/provider/${provider_id}`}
            >
              {provider && provider.name ? provider.name : null}
            </Link>
          </Row>
          <Row className="my-1">
            <LearnAndEarnIcons learnAndEarn={learn_and_earn} />
          </Row>
          <Row className="my-1">
            <div>
              <FontAwesomeIcon icon={faMapMarkerAlt} />{' '}
              {provider && provider.location ? provider.location : '-'}
            </div>
          </Row>
          <Row className="mt-1">
            {length && (
              <div className="unit-tag mr-2 text-white rounded px-1">
                {Number(length) || null} {lengthUnit ? lengthUnit.name : null}
              </div>
            )}
            {frequency && (
              <div className="unit-tag text-white rounded px-1">
                {Number(frequency) || null}{' '}
                {frequencyUnit ? frequencyUnit.name : null}
              </div>
            )}
          </Row>
        </Col>
        <Col span={12} className="text-right">
          <ol>
            <li>Cost : {`$${Number(cost) || '---'}`}</li>
            <li>Pay : {`$${Number(pay) || '---'}`}</li>
            <li>Credit : {`${Number(credit) || '---'}`}</li>
          </ol>
        </Col>
      </Row>
    </Card>
  );
}
