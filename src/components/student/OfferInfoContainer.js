import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAxios, { configure } from 'axios-hooks';
import { last, groupBy, property, uniqueId } from 'lodash';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { TitleDivider } from 'components/shared';
import { InfoCard, InfoLayout } from 'components/student';
import { Carousel } from 'react-responsive-carousel';
import 'assets/scss/responsive-carousel-override.scss';

configure({
  axios: axiosInstance,
});

export default function (props) {
  const { session } = props;
  let { id: offerId } = useParams();
  const [{ data: dataFieldPayload }] = useAxios(
    '/datafields?scope=with_offers'
  );

  async function getOffer(_offerId) {
    const response = await axiosInstance.get(
      `/offers/${_offerId}?scope=with_details`
    );
    offerStore.addOne(response.data);
  }

  async function getProvider(providerId) {
    const response = await axiosInstance.get(
      `/providers/${providerId}?scope=with_details`
    );
    providerStore.addOne(response.data);
  }

  const {
    offer: offerStore,
    provider: providerStore,
    datafield,
  } = useGlobalStore();
  const groupedDataFields = groupBy(datafield.entities, property('type'));
  const offer = offerStore.entities[offerId];

  useEffect(() => {
    if (dataFieldPayload) {
      datafield.addMany(dataFieldPayload);
    }
    if (!offer) {
      getOffer(offerId);
    }
  }, [dataFieldPayload, offer]);

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
        session={session}
        groupedDataFields={groupedDataFields}
      >
        <section style={{ maxWidth: 896 }}>
          {(offer && offer.RelatedOffers && offer.RelatedOffers.length && (
            <>
              <TitleDivider
                title={'RELATED OFFERS'}
                align="center"
                classNames={{ middleSpan: 'text-base' }}
              />
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
                    if (!p) {
                      getProvider(o.provider_id);
                    }
                  }
                  return (
                    <InfoCard
                      key={index}
                      data={o}
                      provider={p}
                      groupedDataFields={groupedDataFields}
                      actions={[
                        <Link to={o && o.id ? `/home/offer/${o.id}` : null}>
                          View
                        </Link>,
                      ]}
                    />
                  );
                })}
              </Carousel>
            </>
          )) ||
            null}
        </section>
        <section style={{ maxWidth: 896 }}>
          {(offer &&
            offer.PrerequisiteOffers &&
            offer.PrerequisiteOffers.length && (
              <>
                <TitleDivider
                  title={'PREREQUISITES'}
                  align="center"
                  classNames={{ middleSpan: 'text-base' }}
                />
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
                      if (!p) {
                        getProvider(o.provider_id);
                      }
                    }
                    return (
                      <InfoCard
                        key={uniqueId('prereq_card_')}
                        data={o}
                        provider={p}
                        groupedDataFields={groupedDataFields}
                        actions={[
                          <Link to={o && o.id ? `/home/offer/${o.id}` : null}>
                            View
                          </Link>,
                        ]}
                      />
                    );
                  })}
                </Carousel>
              </>
            )) ||
            null}
        </section>
      </InfoLayout>
    </div>
  );
}
