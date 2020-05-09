import React from 'react';
import './learn-and-earn-icons.scss';

export default function ({ learnAndEarn, align = 'left' }) {
  if (learnAndEarn === 'learn') {
    return <div className="learn-earn-icon learn-earn-icon--purple">L</div>;
  }
  if (learnAndEarn === 'earn') {
    return <div className="learn-earn-icon learn-earn-icon--blue">E</div>;
  }
  if (learnAndEarn === 'both') {
    return (
      <div
        className={`flex flex-row ${
          align === 'right' ? 'flex-row-reverse' : ''
        }`}
      >
        {' '}
        <div
          className="learn-earn-icon mr-1 learn-earn-icon--purple"
          style={{ width: 23, order: align === 'right' ? 1 : 0 }}
        >
          L
        </div>{' '}
        <div
          className="learn-earn-icon learn-earn-icon--blue"
          style={{ width: 24 }}
        >
          E
        </div>
      </div>
    );
  }
  return null;
}
