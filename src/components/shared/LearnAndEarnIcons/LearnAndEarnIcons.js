import React from 'react';
import './learn-and-earn-icons.scss';

export default function ({ learnAndEarn, align = 'left', style }) {
  if (learnAndEarn === 'learn') {
    return <div className="learn-earn-icon learn-earn-icon--purple">Learn</div>;
  }
  if (learnAndEarn === 'earn') {
    return <div className="learn-earn-icon learn-earn-icon--blue">Earn</div>;
  }
  if (learnAndEarn === 'both') {
    return (
      <div
        style={style}
        className={`flex flex-row ${
          align === 'right' ? 'flex-row-reverse' : ''
        }`}
      >
        {' '}
        <div
          className="learn-earn-icon mr-1 learn-earn-icon--purple"
          style={{ width: 23, order: align === 'right' ? 1 : 0 }}
        >
          Learn
        </div>{' '}
        <div
          className="learn-earn-icon learn-earn-icon--blue"
          style={{ width: 24 }}
        >
          Earn
        </div>
      </div>
    );
  }
  return null;
}
