import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxios, { configure } from 'axios-hooks';
import { last, groupBy, property } from 'lodash';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { TitleDivider } from 'components/shared';
import { InfoCard, InfoLayout } from 'components/student';
import { Carousel } from 'react-responsive-carousel';
import { Empty } from 'antd';
import 'scss/responsive-carousel-override.scss';

configure({
  axios: axiosInstance,
});

export default function (props) {
  const {
    match: { params },
  } = props;
  const [{ data: dataFieldPayload }] = useAxios(
    '/datafields?scope=with_offers'
  );
  const [{ data: offerPayload }] = useAxios('/offers?scope=with_details');
  const [{ data: providerPayload }] = useAxios('/providers');

  useEffect(() => {
    if (dataFieldPayload) {
      datafield.addMany(dataFieldPayload);
    }
    if (offerPayload) {
      offerStore.addMany(offerPayload);
    }
    if (providerPayload) {
      providerStore.addMany(providerPayload);
    }
  }, [dataFieldPayload, offerPayload, providerPayload]);
  const offerId = Number(params.id);
  const {
    offer: offerStore,
    provider: providerStore,
    datafield,
  } = useGlobalStore();
  const groupedDataFields = groupBy(datafield.entities, property('type'));
  const offer = offerStore.entities[offerId];
  let imageSrc = null;
  let alt = '';

  if (offer && offer.Files && offer.Files.length) {
    const { file_link, location } = last(offer.Files);
    imageSrc = file_link;
    alt = location;
  }

  return (
    <div className="flex flex-col items-center">
      <InfoLayout
        data={offer}
        src={imageSrc}
        alt={alt}
        groupedDataFields={groupedDataFields}
      >
        <TitleDivider
          title={'RELATED OFFERS'}
          align="center"
          classNames={{ middleSpan: 'text-base' }}
        />
        <section style={{ maxWidth: 896 }}>
          {(offer && offer.RelatedOffers && offer.RelatedOffers.length && (
            <Carousel
              className="custom-carousel mb-2 cursor-grab"
              centerMode
              infiniteLoop
              centerSlidePercentage={100}
              showArrows={true}
              showIndicators={false}
              swipeable={true}
              emulateTouch={true}
              showThumbs={false}
              showStatus={false}
              swipeScrollTolerance={10}
            >
              {offer.RelatedOffers.map((o, index) => {
                let p = null;
                if (o && o.provider_id) {
                  p = providerStore.entities[o.provider_id];
                }
                return (
                  <InfoCard
                    key={index}
                    data={o}
                    provider={p}
                    groupedDataFields={groupedDataFields}
                    actions={[
                      <Link to={o && o.id ? `/offer/${o.id}` : null}>
                        View
                      </Link>,
                    ]}
                  />
                );
              })}
            </Carousel>
          )) || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </section>
        <TitleDivider
          title={'PREREQUISITES'}
          align="center"
          classNames={{ middleSpan: 'text-base' }}
        />
        <section style={{ maxWidth: 896 }}>
          {(offer &&
            offer.PrerequisiteOffers &&
            offer.PrerequisiteOffers.length && (
              <Carousel
                className="custom-carousel mb-4 cursor-grab"
                centerMode
                infiniteLoop
                centerSlidePercentage={100}
                showArrows={true}
                showIndicators={false}
                swipeable={true}
                emulateTouch={true}
                showThumbs={false}
                showStatus={false}
                swipeScrollTolerance={10}
              >
                {offer.PrerequisiteOffers.map((o, index) => {
                  let p = null;
                  if (o && o.provider_id) {
                    p = providerStore.entities[o.provider_id];
                  }
                  return (
                    <InfoCard
                      key={index}
                      data={o}
                      provider={p}
                      groupedDataFields={groupedDataFields}
                      actions={[
                        <Link to={o && o.id ? `/offer/${o.id}` : null}>
                          View
                        </Link>,
                      ]}
                    />
                  );
                })}
              </Carousel>
            )) || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </section>
      </InfoLayout>
    </div>
  );
}
