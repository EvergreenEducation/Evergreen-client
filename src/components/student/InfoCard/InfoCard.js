import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { find } from 'lodash';
import dayjs from 'dayjs';
import { LearnAndEarnIcons, UnitTag } from 'components/shared';
import './info-card.scss';

const statuses = {
  Inactivate: {
    substituteStatus: 'Applied',
    statusColor: 'rgb(148,0,211)',
    textColor: 'text-white',
  },
  Activated: {
    substituteStatus: 'Enrolled',
    statusColor: 'rgb(0,0,255)',
    textColor: 'text-white',
  },
  Enrolled: {
    substituteStatus: 'Enrolled',
    statusColor: 'rgb(0,0,255)',
    textColor: 'text-white',
  },
  Completed: {
    substituteStatus: 'Passed',
    statusColor: 'rgb(0,255,0)',
    textColor: 'text-gray',
  },
  Approved: {
    substituteStatus: 'Enrolled',
    statusColor: 'rgb(0,0,255)',
    textColor: 'text-white',
  },
  Unenrolled: {
    substituteStatus: 'Unenrolled',
    statusColor: 'rgba(255,255,0,0.2)',
    textColor: 'text-gray',
  },
  Failed: {
    substituteStatus: 'Failed',
    statusColor: 'rgb(255,99,132)',
    textColor: 'text-gray',
  },
};

function InfoCardFooter(props) {
  const { enrollment = null } = props;
  let text = (
    <p className="text-gray font-bold" style={{ minWidth: 68 }}>
      Unenrolled
    </p>
  );
  let backgroundColor = 'rgba(255,255,0,0.2)';

  if (enrollment && enrollment.status) {
    text = (
      <p
        className={`${
          enrollment && enrollment.status
            ? statuses[enrollment.status]
              ? statuses[enrollment.status].textColor
              : null
            : 'text-gray'
        } font-bold info-card__statusText`}
        style={{ minWidth: 68 }}
      >
        {enrollment.status === 'Completed' || enrollment.status === 'Failed' ? (
          <span>Credit&nbsp;&nbsp;{enrollment.credit}</span>
        ) : statuses[enrollment.status] ? (
          statuses[enrollment.status].substituteStatus
        ) : null}
      </p>
    );
    backgroundColor = statuses[enrollment.status]
      ? statuses[enrollment.status].statusColor
      : 'rgba(255,255,0,0.2)';
  }

  return (
    <div
      className="h-auto flex flex-col justify-center text-center"
      style={{
        width: 31,
        background: backgroundColor,
      }}
    >
      <aside
        className="h-auto relative w-auto"
        style={{
          bottom: '1.5em',
          transform: 'rotate(90deg)',
        }}
      >
        {text}
      </aside>
    </div>
  );
}

export default function ({
  data,
  provider = {},
  groupedDataFields,
  style,
  className,
  actions = [],
  enableStatus = false,
  latestEnrollment,
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
    <div className={`flex flex-row shadow ${className}`}>
      <Card className={`info-card`} style={style}>
        <Row>
          <Col span={12}>
            <Row className="mb-1 flex-col">
              <span className="text-left font-bold">{name}</span>
              <Link
                className={`text-xs font-normal text-left ${
                  provider_id ? '' : 'pointer-events-none'
                }`}
                to={`/home/provider/${provider_id}`}
                onClick={(e) => e.stopPropagation()}
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
              {length && <UnitTag number={length} unit={lengthUnit} />}
              {frequency && <UnitTag number={frequency} unit={frequencyUnit} />}
            </Row>
          </Col>
          <Col span={12} className="text-right">
            <ol>
              <li>
                Cost :{' '}
                {`$${
                  Number(cost).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  }) || '---'
                }`}
              </li>
              <li>
                Pay :{' '}
                {`$${
                  Number(pay).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  }) || '---'
                }`}
              </li>
              <li>Credit : {`${Number(credit).toLocaleString() || '---'}`}</li>
            </ol>
          </Col>
        </Row>
      </Card>
      {(enableStatus && <InfoCardFooter enrollment={latestEnrollment} />) ||
        null}
    </div>
  );
}
