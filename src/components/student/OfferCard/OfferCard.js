import React from 'react';
import { Card, Col, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faCalendar,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { find } from 'lodash';
import dayjs from 'dayjs';
import './offer-card.scss';

function renderLearnAndEarn(learn_and_earn) {
  if (learn_and_earn === 'earn') {
    return <div className="learn-earn-icon learn-earn-icon--blue">E</div>;
  }
  if (learn_and_earn === 'both') {
    return (
      <>
        {' '}
        <div className="learn-earn-icon mr-1 learn-earn-icon--purple">
          L
        </div>{' '}
        <div className="learn-earn-icon learn-earn-icon--blue">E</div>
      </>
    );
  }
  if (learn_and_earn === 'learn') {
    return <div className="learn-earn-icon learn-earn-icon--purple">L</div>;
  }
  return null;
}

export default function ({
  offer,
  provider,
  groupedDataFields,
  style,
  className,
}) {
  const {
    name: offerName,
    learn_and_earn,
    cost,
    pay,
    credit,
    length_unit,
    frequency_unit,
    length,
    frequency,
  } = offer;
  let { start_date } = offer;
  start_date = dayjs(start_date).format('MMM DD, YYYY');
  const { name: providerName, location } = provider;
  const lengthUnit = find(groupedDataFields.length_unit, ({ id }) => {
    return id === Number(length_unit);
  });
  const frequencyUnit = find(groupedDataFields.frequency_unit, ({ id }) => {
    return id === Number(frequency_unit);
  });

  return (
    <Card title={offerName} className={`offer-card ${className}`} style={style}>
      <Row>
        <Col span={12}>
          <Row>{providerName}</Row>
          <Row>{renderLearnAndEarn(learn_and_earn)}</Row>
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
