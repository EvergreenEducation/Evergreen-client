import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import {  filter, orderBy } from 'lodash';
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
  let getLastData 
  if(type === "main"){
    getLastData = data && data.banner_image.map(item => {
      let parseData = JSON.parse(item)
      return parseData
    })
  }if(type === "local"){
    getLastData = data && data.main_image.map(item => {
      let parseData = JSON.parse(item)
      return parseData
    })
  }
  

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
  const [imageValue, setImageValue] = useState()

  const getImageurl = async (item) => {
    debugger
    if(item){
      let getimage = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/files/get_image_url/${item.original}/${item.name}`, {
      })
      debugger
      return getimage
    }else{
      return false
    }
  }
  // console.log('promocard render',data)
  const handleImage = async () => {
    let getImageArr = []
    for (let i=0; i<= getLastData.length; i++){
      // debugger
      let imageData = await getImageurl(getLastData[i]);
      debugger
      console.log('imageData',imageData)
      if(imageData){
        getImageArr.push(imageData.data.data)
      }

    }
    setImageValue(getImageArr)
    // getLastData && getLastData.length && getLastData.map(async item => {
    // })
  }

  useEffect(() => {
    handleImage()
  },[])
  // console.log("getLastData", getLastData)
  console.log("imageData", imageValue);
  return (
    <Link to={link} key={`Link-Card-${data.id}`} className="text-base font-bold promoCard__link" onClick={() => handleCheckButton(data)} key={data.id}>
      <Card
      key={`Card-${data.id}`}
        className={`promoCard ${className}`}
        cover={
          imageValue !== null ? [0].map((item,i) => {
            return (
              <img
                className="object-cover bg-gray-200"
                src={imageValue && imageValue.length ? imageValue[0] : ""}
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
