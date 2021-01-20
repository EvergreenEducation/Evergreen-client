import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { filter, orderBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './promo-card.scss';
const axios = require('axios').default;

export default function ({
  data,
  size = 'default',
  className,
  banner = false,
  bannerImage,
  slideType,
  type
}) {
  const [imageValue, setImageValue] = useState([])
  const [isImageCheck, setIsImageCheck] = useState([])
  const [image, setImage] = useState([])

  var getLastData
  useEffect(() => {
    if (type === "main") {
      let parseData = JSON.parse(data.banner_image[0]);
      getLastData = parseData

    } else {
      let parseData = JSON.parse(data.main_image[0]);
      getLastData = parseData
    }
    handleImage()
  }, [])

  let files = [];
  if (banner) {
    files = filter(data.Files, ['meta', 'banner-image']);
  } else {
    files = filter(data.Files, (f) => f.meta !== 'banner-image');
  }

  files = orderBy(files, ['createdAt', 'asc']);

  // const imageSrc = files.length && last(files) ? last(files).file_link : null;

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


  const getImageurl = async (item) => {
    if (getLastData) {
      let getimage = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/files/get_image_url/${item.original}/${item.name}`, {

      })
      return getimage
    } else {
      return false
    }
  }

  const handleImage = async () => {
    let getImageArr = [];
    await getImageurl(getLastData).then(async resp => {
      if (resp.data) {
        getImageArr.push(resp.data)
      }
    })
    setImageValue(getImageArr)
  }

  return (
    <Link to={link} key={`Link-Card-${data.id}`} className="text-base font-bold promoCard__link" onClick={() => handleCheckButton(data)} key={data.id}>

      <Card
        key={`Card-${data.id}`}
        className={`promoCard ${className}`}
        cover={
          imageValue && imageValue.length ? imageValue.map((item, i) => {
            return (
              <img
                decoding="async"
                className="object-cover bg-gray-200"
                src={item.data}
                alt={`${slideType}-${data.id}-${i}`}
                style={{ height: size !== 'small' ? 325 : 220 }}
                key={`getLastData-${data.id}`}
              />
            )
          }
          )
            :
            <div
              className="flex bg-gray-200"
              style={{ height: size !== 'small' ? 325 : 220 }}
            >
              <FontAwesomeIcon
                className="text-6xl text-gray-400 m-auto block"
                icon={`bannerImage`}
              />
            </div>
        }
      >
        {/* {data.entity_type && (
          <span className="block font-normal absolute promoCard__entityType py-1 px-3 bg-black text-white bg-opacity-50 capitalize">
            {data.entity_type}
          </span>
        )} */}
        <span className="block promoCard__link text-base">{data.name}</span>
      </Card>
    </Link >
  );
}
