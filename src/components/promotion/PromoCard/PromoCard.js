import React from 'react';
import { Card } from 'antd';
import { last } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import './promo-card.scss';
import { Link } from 'react-router-dom';

export default function ({ data, size = 'default' }) {
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
    <Card
      className="promoCard shadow"
      title={data.entity_type}
      cover={
        imageSrc ? (
          <img
            className="object-cover"
            src={imageSrc}
            alt=""
            style={{ height: size !== 'small' ? 200 : 150 }}
          />
        ) : (
          <div
            className="flex bg-gray-200"
            style={{ height: size !== 'small' ? 200 : 150 }}
          >
            <FontAwesomeIcon
              className="text-6xl text-gray-400 m-auto block"
              icon={faImage}
            />
          </div>
        )
      }
      actions={[
        <Link to={link} className="text-base font-bold promoCard__link">
          {data.name}{' '}
          <FontAwesomeIcon
            className="text-2xl relative"
            style={{ top: 3 }}
            icon={faAngleDoubleRight}
          />
        </Link>,
      ]}
    ></Card>
  );
}
