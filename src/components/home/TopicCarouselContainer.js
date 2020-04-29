import React, { useEffect, useState } from 'react';
import useAxios, { configure } from 'axios-hooks';
import { Card, Button } from 'antd';
import { groupBy, property, find } from 'lodash';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'scss/responsive-carousel-override.scss';

configure({
  axios: axiosInstance,
});

export default function () {
  const { datafield, offer: offerStore, provider } = useGlobalStore();
  const topics = Object.values(datafield.entities).filter(
    (d) => d.type === 'topic'
  );

  const groupedDataFields = groupBy(datafield.entities, property('type'));

  const [{ data: dataFieldPayload }] = useAxios(
    '/datafields?scope=with_offers'
  );
  const [{ data: offerPayload }] = useAxios('/offers?scope=with_details');
  const [{ data: providerPayload }] = useAxios('/providers');

  const [currentTopic, setCurrentTopic] = useState(null);

  const handleChange = (e) => {};

  const handleCurrentItem = (current, total) => {
    const index = current - 1;
    setTimeout(() => {
      setCurrentTopic(topics[index]);
    }, 50);
    return null;
  };

  const renderArrowBtns = (
    onClickHandler,
    hasPrevOrNext,
    label,
    icon,
    style = { right: 15 }
  ) => {
    if (!icon) {
      return null;
    }
    return (
      hasPrevOrNext && (
        <Button
          type="link"
          onClick={onClickHandler}
          className="custom-control-arrow flex justify-center"
          style={style}
        >
          <FontAwesomeIcon icon={icon} />
        </Button>
      )
    );
  };

  const renderOffers = () => {
    const currentOffers = [];
    for (let i = 0; i < currentTopic.Offers.length; i++) {
      const offerId = currentTopic.Offers[i].id;
      currentOffers.push(offerStore.entities[offerId]);
    }

    return currentOffers.map((offer, index) => {
      console.log(offer);
      console.log(index);
      const lengthUnit = find(groupedDataFields.length_unit, (item) => {
        return item.id === Number(offer.length_unit);
      });
      const frequencyUnit = find(groupedDataFields.frequency_unit, (item) => {
        return item.id === Number(offer.frequency_unit);
      });
      const p = provider.entities[offer.provider_id];
      return (
        <Card title={offer.name} key={index}>
          Provider: {p.name}
          <ol>
            <li>Learn and earn: {offer.learn_and_earn}</li>
            <li>Cost: {`$${Number(offer.cost) || 'N/A'}`}</li>
            <li>Pay: {`$${Number(offer.pay) || 'N/A'}`}</li>
            <li>Credit: {`$${Number(offer.credit) || 'N/A'}`}</li>
            <li>
              Length: {Number(offer.length)} {lengthUnit.name}
            </li>
            <li>
              Frequency: {Number(offer.frequency)} {frequencyUnit.name}
            </li>
          </ol>
        </Card>
      );
    });
  };

  useEffect(() => {
    if (dataFieldPayload) {
      datafield.addMany(dataFieldPayload);
    }
    if (offerPayload) {
      offerStore.addMany(offerPayload);
    }
    if (providerPayload) {
      provider.addMany(providerPayload);
    }
  }, [dataFieldPayload, offerPayload, providerPayload]);

  return (
    <div>
      <h1 className="text-center">Offers by Topics</h1>
      <Carousel
        className="custom-carousel"
        showArrows={true}
        showIndicators={false}
        swipeable={true}
        emulateTouch={true}
        centerSlidePercentage={80}
        onChange={handleChange}
        showStatus={true}
        statusFormatter={handleCurrentItem}
        showThumbs={false}
        renderArrowNext={(...rest) => {
          return renderArrowBtns(...rest, faArrowRight);
        }}
        renderArrowPrev={(...rest) => {
          return renderArrowBtns(...rest, faArrowLeft, { left: 15 });
        }}
      >
        {topics.map((topic, index) => {
          if (!topic) {
            return null;
          }
          return (
            <Card
              className="mx-auto text-white text-lg w-auto"
              style={{ width: 375, backgroundColor: '#0e75d4' }}
              key={index}
            >
              {topic.name}
            </Card>
          );
        })}
      </Carousel>
      <main>{currentTopic && renderOffers()}</main>
    </div>
  );
}
