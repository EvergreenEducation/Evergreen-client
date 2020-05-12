import React, { useEffect } from 'react';
import useAxios, { configure } from 'axios-hooks';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { Carousel } from 'react-responsive-carousel';
import { TitleDivider } from 'components/shared';
import PromoCard from 'components/promotion/PromoCard/PromoCard';
import 'assets/scss/responsive-carousel-override.scss';
import './promo-carousels-container.scss';

configure({
  axios: axiosInstance,
});

export default function () {
  const {
    offer: offerStore,
    provider: providerStore,
    pathway: pathwayStore,
  } = useGlobalStore();

  const [{ data: getPathways }] = useAxios('/pathways?scope=with_files');

  const [{ data: getOffers }] = useAxios('/offers?scope=with_files');

  const [{ data: getProviders }] = useAxios('/providers?scope=with_files');

  const offers = Object.values(offerStore.entities).map((o) => {
    return {
      ...o,
      entity_type: 'offer',
    };
  });

  const providers = Object.values(providerStore.entities).map((p) => {
    return {
      ...p,
      entity_type: 'provider',
    };
  });

  const pathways = Object.values(pathwayStore.entities).map((p) => {
    return {
      ...p,
      entity_type: 'pathway',
    };
  });

  const data = [...offers, ...pathways, ...providers];

  useEffect(() => {
    if (getPathways) {
      pathwayStore.addMany(getPathways);
    }
    if (getOffers) {
      offerStore.addMany(getOffers);
    }
    if (getProviders) {
      providerStore.addMany(getProviders);
    }
  }, [getPathways, getOffers, getProviders]);

  const localPromos = data.filter((d) => {
    return d.is_local_promo;
  });

  const mainPromos = data.filter((d) => {
    return d.is_main_promo;
  });
  return (
    <div className="h-auto w-full">
      <TitleDivider
        title={'MAIN PROMOS'}
        align="center"
        classNames={{ middleSpan: 'text-base' }}
      />
      <Carousel
        className="custom-carousel promoCarousel mb-2 cursor-grab"
        centerMode
        infiniteLoop
        centerSlidePercentage={100}
        showArrows={true}
        showIndicators={true}
        swipeable={true}
        emulateTouch={true}
        showStatus={false}
        showThumbs={false}
        interval={7000}
        autoPlay={true}
        swipeScrollTolerance={1}
      >
        {mainPromos.map((promo, index) => {
          return <PromoCard key={index} data={promo} />;
        })}
      </Carousel>
      <TitleDivider
        title={'LOCAL PROMOS'}
        align="center"
        classNames={{ middleSpan: 'text-base' }}
      />
      <Carousel
        className="custom-carousel promoCarousel mb-2 cursor-grab"
        centerMode
        infiniteLoop
        centerSlidePercentage={100}
        showArrows={true}
        showIndicators={true}
        swipeable={true}
        emulateTouch={true}
        showStatus={false}
        showThumbs={false}
        interval={7000}
        autoPlay={true}
        swipeScrollTolerance={1}
      >
        {localPromos.map((promo, index) => {
          return <PromoCard key={index} data={promo} />;
        })}
      </Carousel>
    </div>
  );
}