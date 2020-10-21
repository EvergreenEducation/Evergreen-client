import React, { useEffect, useState } from 'react';
import useGlobalStore from 'store/GlobalStore';
import { Carousel } from 'react-responsive-carousel';
import { TitleDivider } from 'components/shared';
import PromoCard from 'components/promotion/PromoCard/PromoCard';
import 'assets/scss/responsive-carousel-override.scss';
import './promo-carousels-container.scss';
const axios = require('axios').default;

export default function (props) {
  const [localSliderPercentage, setLocalSliderPercentage] = useState(100);
  const {
    offer: offerStore,
    provider: providerStore,
    pathway: pathwayStore,
  } = useGlobalStore();
  const [bannerImage, setBannerImage] = useState({})
  let { activePageId } = props;
  //  console.log("------------",pathwayStore)

  const getBannerApi = async () => {
    // let token = JSON.parse(localStorage.getItem("currentSession"))
    // let user_id = token.id
    // let user_role = token.role
    let Data = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/get_images_list`)
    return Data
  }
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

  const localPromos = data.filter((d) => {
    return d.custom_page_local_ids.includes(activePageId.id);
  });

  const mainPromos = data.filter((d) => {
    return d.custom_page_promo_ids.includes(activePageId.id);
  });

  useEffect(() => {
    const handleSliderPercentOnResize = () => {
      if (window.innerWidth >= 769) {
        setLocalSliderPercentage(34);
      } else {
        setLocalSliderPercentage(100);
      }
    };

    if (window.innerWidth >= 769) {
      setLocalSliderPercentage(34);
    } else {
      setLocalSliderPercentage(100);
    }

    window.addEventListener('resize', handleSliderPercentOnResize);

    return () =>
      window.removeEventListener('resize', handleSliderPercentOnResize);
  }, [localSliderPercentage]);

  useEffect(() => {
    getBannerApi().then(resp => {
      if (resp.status == 200) {
        var output = resp.data.data.map(s => ({ banner_image: s.landing_image, id: s.id, image_url: s.image_url }));
        setBannerImage(output)
      }
    }).catch(error => {
      console.log("errror", error)
    })
  }, [])

  // console.log("bannerImage",bannerImage)
  // console.log('mainPromos',mainPromos)
  const concat = (...arrays) => [].concat(...arrays.filter(Array.isArray));
  // console.log(concat(bannerImage, mainPromos),"zzzzzzzzzzzzzzzzz");
  const FinalImageData = concat(bannerImage, mainPromos)
  // console.log('localPromos', localPromos)

    const finalPromoData = localPromos.filter(function (item, index, inputArray) {
      if (item === null || item === undefined) {
        return false
      } else {
        return inputArray.indexOf(item) == index;
      }
    });

    //  console.log("sadasdasdasd",finalPromoData)
  return (
    <div className="h-auto w-full">
      <Carousel
        className="custom-carousel promoCarousel mb-2 cursor-grab"
        centerMode
        infiniteLoop
        centerSlidePercentage={100}
        showArrows={true}
        showIndicators={false}
        swipeable={true}
        emulateTouch={true}
        showStatus={false}
        showThumbs={false}
        interval={7000}
        autoPlay={true}
        swipeScrollTolerance={1}
      >
        {FinalImageData.map((promo, index) => {
          // console.log("pro", promo)
          return <PromoCard key={`FinalImageData-slide-${promo.id}`} index={index} data={promo} banner={true} bannerImage={bannerImage} slideType='FinalImageData' />;
        })}
      </Carousel>
      <TitleDivider
        title={'LOCAL PROMOS'}
        align="center"
        classNames={{ middleSpan: 'text-base' }}
      />

      {localPromos.length ? <Carousel
        className="custom-carousel promoCarousel mb-2 cursor-grab"
        centerMode
        infiniteLoop
        centerSlidePercentage={localSliderPercentage}
        showArrows={true}
        showIndicators={false}
        swipeable={true}
        emulateTouch={true}
        showStatus={false}
        showThumbs={false}
        interval={7000}
        autoPlay={true}
        swipeScrollTolerance={localPromos.length}
        key={`localPromos-slide-local`}
      >
        {localPromos.map((promo, index) => {
          console.log('localdata map running', promo)
          return (
            <PromoCard key={`localPromos-slide-${promo.id}`} index={index} data={promo} size="small" className="mx-1" slideType='localPromos' />
          );
        })}
      </Carousel>

        : ''}
    </div>
  );
}
