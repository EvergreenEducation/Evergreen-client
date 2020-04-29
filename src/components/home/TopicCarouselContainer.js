import React, { useEffect, useState } from 'react';
import useAxios, { configure } from 'axios-hooks';
import { Card, Button } from 'antd';
import { groupBy, property } from 'lodash';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { OfferCard } from 'components/student';
import TitleDivider from 'components/TitleDivider';
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
      const p = provider.entities[offer.provider_id];

      return (
        <OfferCard
          className="mx-auto my-2"
          offer={offer}
          provider={p}
          groupedDataFields={groupedDataFields}
          key={index}
        />
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
    <div className="h-auto">
      <TitleDivider title={'OFFERS BY TOPICS'} />
      <Carousel
        className="custom-carousel mb-2"
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
        swipeScrollTolerance={1}
      >
        {topics.map((topic, index) => {
          if (!topic) {
            return null;
          }
          return (
            <Card
              className="mx-auto text-white text-lg w-auto"
              style={{ width: 375, backgroundColor: 'rgb(7, 25, 80)' }}
              key={index}
            >
              {topic.name}
            </Card>
          );
        })}
      </Carousel>
      <main className="p-2">{currentTopic && renderOffers()}</main>
    </div>
  );
}
