import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { last, filter, orderBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import './promo-card.scss';

export default function ({
  data,
  size = 'default',
  style,
  className,
  banner = false,
  bannerImage,
  slideType
}) {

  let getLastData = data && data.banner_image.map(item => {
    let parseData = JSON.parse(item)
    return parseData
  })

  let files = [];
  if (banner) {
    files = filter(data.Files, ['meta', 'banner-image']);
  } else {
    files = filter(data.Files, (f) => f.meta !== 'banner-image');
  }

  files = orderBy(files, ['createdAt', 'asc']);

  const imageSrc = files.length && last(files) ? last(files).file_link : null;

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

  const handleCheckButton = (data) => {
    if (data.image_url) {
      window.open(
        `${data.image_url}`); 
    }
  }
  console.log('promocard render',data)
  return (
    <Link to={link} key={`Link-Card-${data.id}`} className="text-base font-bold promoCard__link" onClick={() => handleCheckButton(data)} key={data.id}>
      <Card
      key={`Card-${data.id}`}
        className={`promoCard ${className}`}
        cover={
          getLastData !== null ? getLastData.map(item => {
            // console.log("getLastData", item)
            return (
              <img
                className="object-cover bg-gray-200"
                src={item.original}
                alt={`${slideType}-${data.id}`}
                style={{ height: size !== 'small' ? 325 : 220 }}
                key={`getLastData-${data.id}`}
              />
            )
          })
            :
            <div
              className="flex bg-gray-200"
              style={{ height: size !== 'small' ? 325 : 220 }}
            >
              <FontAwesomeIcon
                className="text-6xl text-gray-400 m-auto block"
                icon={bannerImage}
              />
            </div>
        }
      >
        {data.entity_type && (
          <span className="block font-normal absolute promoCard__entityType py-1 px-3 bg-black text-white bg-opacity-50 capitalize">
            {data.entity_type}
          </span>
        )}
        <span className="block promoCard__link text-base">{data.name}</span>
      </Card>
    </Link >
  );
}
