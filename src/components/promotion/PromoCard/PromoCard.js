import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { last } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import './promo-card.scss';

export default function ({ data, size = 'default', style, className }) {
  const imageSrc =
    last(data.Files) && last(data.Files).file_link
      ? last(data.Files).file_link
      : null;

  let link = '/';
  if (data.entity_type === 'provider') {
    link = `/home/provider/${data.id}`;
  }
  if (data.entity_type === 'offer') {
    link = `/home/offer/${data.id}`;
  }
  if (data.entity_type === 'pathway') {
    link = `/home/pathway/${data.id}`;
  }
  return (
    <Link to={link} className="text-base font-bold promoCard__link">
      <Card
        className={`promoCard ${className}`}
        cover={
          imageSrc ? (
            <img
              className="object-contain bg-gray-200"
              src={imageSrc}
              alt=""
              style={{ height: size !== 'small' ? 325 : 220 }}
            />
          ) : (
            <div
              className="flex bg-gray-200"
              style={{ height: size !== 'small' ? 325 : 220 }}
            >
              <FontAwesomeIcon
                className="text-6xl text-gray-400 m-auto block"
                icon={faImage}
              />
            </div>
          )
        }
      >
        {data.entity_type && (
          <span className="block font-normal absolute promoCard__entityType py-1 px-3 bg-black text-white bg-opacity-50 capitalize">
            {data.entity_type}
          </span>
        )}
        <span className="block promoCard__link text-base">{data.name}</span>
      </Card>
    </Link>
  );
}
