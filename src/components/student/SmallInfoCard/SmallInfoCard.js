import React from 'react';
import dayjs from 'dayjs';
import { LearnAndEarnIcons } from 'components/shared';
import './small-info-card.scss';

export default function ({ children, offer = null, color = 'primary' }) {
  return (
    <div className={`smallInfoCard rounded mb-2 bg-white`}>
      <div className="flex flex-row justify-between px-2 pt-2">
        <div>
          <span className="block text-base font-bold mb-0 pb-0">
            {offer && offer.name ? offer.name : null}
          </span>
          <span className="block text-xs">
            {offer && offer.Provider && offer.Provider.name
              ? offer.Provider.name
              : null}
          </span>
        </div>
        <div className="text-right">
          {offer && offer.start_date
            ? dayjs(offer.start_date).format('MM-DD-YYYY')
            : '-----'}
          <LearnAndEarnIcons
            align="right"
            learnAndEarn={offer ? offer.learn_and_earn : null}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between pt-1 px-2 pb-2 text-xs">
        <span>Cost: ${offer ? offer.cost : '---'}</span>
        <span>Credit: ${offer ? offer.credit : '---'}</span>
        <span>Pay: ${offer ? offer.pay : '---'}</span>
      </div>
      <div className={`smallInfoCard__footer text-right p-2`}>{children}</div>
    </div>
  );
}
