import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { last, groupBy, property, uniqueId } from 'lodash';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { TitleDivider } from 'components/shared';
import { InfoCard, InfoLayout } from 'components/student';
import { Carousel } from 'react-responsive-carousel';
import 'assets/scss/responsive-carousel-override.scss';

const centerSlidePercentage = 90;

export default function (props) {
  const { session, getOffers } = props;
  let { id: offerId } = useParams();
  const { datafield, offer: offerStore } = useGlobalStore();
  useEffect(() => {
    const getOffer = async () => {
      const { data } = await axiosInstance.get(
        `/offers/${offerId}?scope=with_details`
      );
      if (!offerStore.entities[offerId]) {
        offerStore.addOne(data);
      }
    };
    getOffer();
  }, []);

  let offer = offerStore.entities[offerId];

  if (!offer) {
    return null;
  }

  const groupedDataFields = groupBy(
    Object.values(datafield.entities),
    property('type')
  );

  let imageSrc = null;
  let provider = offer.Provider;
  let alt = '';

  if (offer && offer.Files && offer.Files.length) {
    const { file_link, location } = last(offer.Files);
    imageSrc = file_link;
    alt = location;
  }

  const [activeGenericOffer, setActiveGenericOffer] = useState([]);

  // find generic offer of child
  function findChildGenericOfferID() {
    // console.log('findChildGenericOfferID', getOffers)
    let genericOfferDetail = {};
    if (getOffers) {
      for (let i = 0; i < getOffers.length; i++) {
        if (getOffers[i].id === Number(offerId)) {
          if (getOffers[i].generic_type) {
            genericOfferDetail.is_parent = false;
            genericOfferDetail.generic_type = getOffers[i].generic_type;
            return genericOfferDetail
          } else {
            genericOfferDetail.is_parent = true;
            genericOfferDetail.generic_type = null;
            return genericOfferDetail
          }
        }
      }
    } else {
      return false
    }
  }
  // filter generic offer data
  function filterGenericOfferData(id) {
    if (getOffers) {
      let activeGenericOfer = getOffers.filter(x => {
        if (x.id === id) {
          return x
        }
      });
      return activeGenericOfer;
    }
  }

  // get all child generic data
  const allChildGenericData = () => {
    if (getOffers) {
      let activeGenericOfer = getOffers.filter(x => {
        if (x.generic_type) {
          if (Number(x.generic_type) === Number(offerId)) {
            return x
          }
        }
      });
      // console.log('allChildGenericData', activeGenericOfer)
      return activeGenericOfer;
    }
  }

  // get generic offer data from offer api data
  function getGenericOfferData() {
    let genericOfferId = findChildGenericOfferID(),
      activeGenericOfferData = genericOfferId ? genericOfferId.is_parent ? allChildGenericData() : filterGenericOfferData(Number(genericOfferId.generic_type)) : '';
    // console.log('activeGenericOfferData', activeGenericOfferData)
    if (activeGenericOfferData) {
      setActiveGenericOffer(activeGenericOfferData)
    }
  }

  useEffect(() => {
    getGenericOfferData()
  }, []);

  // const [checkEnroll,setCheckEnroll]=useState({})
 console.log("offer",offer)
  return (
    <div className="flex flex-col items-center">
      <InfoLayout
        data={offer}
        src={imageSrc}
        alt={alt}
        session={session}
        groupedDataFields={groupedDataFields}
        type="offer"
        
        >
        <section style={{ maxWidth: 896 }}>
          {(offer && offer.RelatedOffers && offer.RelatedOffers.length && (
            <>
              <TitleDivider
                title={'RELATED OFFERS'}
                align="center"
                classNames={{ middleSpan: 'text-base' }} />
              <Carousel
                className="custom-carousel mb-2 cursor-grab"
                centerMode
                infiniteLoop
                centerSlidePercentage={offer.RelatedOffers.length === 1 ? 100 : centerSlidePercentage}
                showArrows={true}
                showIndicators={false}
                swipeable={true}
                emulateTouch={true}
                showThumbs={false}
                showStatus={false}
                swipeScrollTolerance={10}>
                {offer.RelatedOffers.map((o, index) => {
                  return (
                    <Link
                      key={uniqueId('related_card_')}
                      to={o && o.id ? `/home/offer/${o.id}` : null}>
                      <InfoCard
                        data={o}
                        provider={provider}
                        groupedDataFields={groupedDataFields} />
                    </Link>
                  );
                })}
              </Carousel>
            </>
          )) ||
            null}
        </section>
        <section style={{ maxWidth: 896 }}>
          {(activeGenericOffer.length && (
            <>
            {/* {console.log("checkEnroll",checkEnroll)} */}
              <TitleDivider
                title={ activeGenericOffer && activeGenericOffer.length && activeGenericOffer[0].is_generic ? 'GENERIC OFFERS' : 'OFFERS'}
                align="center"
                classNames={{ middleSpan: 'text-base' }} />
               {activeGenericOffer.map((o, index) => {
                  // console.log('activeGenericOffer..', o)
                  return (
                    <Link
                      key={uniqueId('related_card_')}
                      to={o && o.id ? `/home/offer/${o.id}` : null}>
                      <InfoCard
                        data={o}
                        provider={provider}
                        groupedDataFields={groupedDataFields} />
                    </Link>
                  );
                })}
              {/* <Carousel
                className="custom-carousel mb-2 cursor-grab"
                centerMode
                infiniteLoop
                centerSlidePercentage={activeGenericOffer.length === 1 ? 100 : centerSlidePercentage}
                showArrows={true}
                showIndicators={false}
                swipeable={true}
                emulateTouch={true}
                showThumbs={false}
                showStatus={false}
                swipeScrollTolerance={10}>
                {activeGenericOffer.map((o, index) => {
                  // console.log('activeGenericOffer..', o)
                  return (
                    <Link
                      key={uniqueId('related_card_')}
                      to={o && o.id ? `/home/offer/${o.id}` : null}>
                      <InfoCard
                        data={o}
                        provider={provider}
                        groupedDataFields={groupedDataFields} />
                    </Link>
                  );
                })}
              </Carousel> */}
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
                  classNames={{ middleSpan: 'text-base' }} />
                <Carousel
                  className="custom-carousel mb-4 cursor-grab"
                  centerMode
                  infiniteLoop
                  centerSlidePercentage={offer.PrerequisiteOffers.length === 1 ? 100 : centerSlidePercentage}
                  showArrows={true}
                  showIndicators={false}
                  swipeable={true}
                  emulateTouch={true}
                  showThumbs={false}
                  showStatus={false}
                  swipeScrollTolerance={10}>
                  {offer.PrerequisiteOffers.map((o, index) => {
                    return (
                      <Link
                        key={uniqueId('prereq_card_')}
                        to={o && o.id ? `/home/offer/${o.id}` : null}>
                        <InfoCard
                          data={o}
                          provider={provider}
                          groupedDataFields={groupedDataFields}/>
                      </Link>
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
