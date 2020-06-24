import React from 'react';
import { Link } from 'react-router-dom';
import './small-info-card.scss';

export default function ({ children, offer = null, color = 'primary' }) {
  return (
    <div className={`smallInfoCard rounded mb-2 bg-white`}>
      <div className="flex flex-row justify-between px-2 pt-2">
        <div className="flex flex-col">
          {(offer && offer.external_url && (
            <a
              className="text-left font-bold"
              style={{ zIndex: 33 }}
              href={offer.external_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {offer.name}
            </a>
          )) || (
            <span className="block text-base font-bold mb-0 pb-0">
              {offer && offer.name ? offer.name : null}
            </span>
          )}
          {(offer && offer.Provider && (
            <Link
              className={`text-xs font-normal text-left relative ${
                offer.Provider.id ? '' : 'pointer-events-none'
              }`}
              style={{ bottom: 3 }}
              to={`/home/provider/${offer.Provider.id}`}
            >
              {offer.Provider.name}
            </Link>
          )) ||
            null}
        </div>
      </div>
      <div className="flex flex-row justify-between pt-1 px-2 pb-2 text-xs">
        <span>Cost: ${offer ? offer.cost : '---'}</span>
        <span>Credit: {offer ? offer.credit : '---'}</span>
        <span>Pay: ${offer ? offer.pay : '---'}</span>
      </div>
      <div className={`smallInfoCard__footer text-right p-2`}>{children}</div>
    </div>
  );
}
