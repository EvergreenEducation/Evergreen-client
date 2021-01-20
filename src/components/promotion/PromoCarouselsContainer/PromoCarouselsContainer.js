import React, { useEffect, useState } from 'react';
import useGlobalStore from 'store/GlobalStore';
import { Carousel } from 'react-responsive-carousel';
// import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
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
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
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
    // debugger
    console.log("activePageId", activePageId)
    return d.custom_page_local_ids.length ? d.custom_page_local_ids.includes(activePageId.id) : false;
  });
  const mainPromos = data.filter((d) => {
    return d.custom_page_promo_ids.length ? d.custom_page_promo_ids.includes(activePageId.id) : false;
  });
  console.log("localPromos ...", localPromos)

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
  let newA = []
  let windowUrl = window.location.pathname
  windowUrl = windowUrl.split('/').pop()
  //  console.log("inssssssssss",windowUrl)

  useEffect(() => {
    getBannerApi().then(async resp => {
      if (resp.status === 200) {
        var output = await resp.data.data.map(s => ({ banner_image: s.landing_image, id: s.id, image_url: s.image_url, page_url_check: s.page_url_check }));
        var defaultFilterData = await output && output.length && output.map(newItem => {
          if (newItem.page_url_check === windowUrl) {
            console.log("inside", newItem)
            newA.push(newItem)
            setBannerImage(newA)
          } else if (windowUrl == "home" && newItem.page_url_check == "default") {
            // console.log("outside",newItem)
            newA.push(newItem)
            setBannerImage(newA)
          }
        })
      }
    }).catch(error => {
      console.log("errror", error)
    })
  }, [])

  // console.log("bannerImage",windowUrl)
  // console.log('mainPromos',mainPromos)
  const concat = (...arrays) => [].concat(...arrays.filter(Array.isArray));
  // console.log(concat(bannerImage, mainPromos),"zzzzzzzzzzzzzzzzz");
  const FinalImageData = concat(bannerImage, mainPromos)
  // console.log('localPromos', localPromos)

  // const finalPromoData = localPromos.filter(function (item, index, inputArray) {
  //   if (item === null || item === undefined) {
  //     return false
  //   } else {
  //     return inputArray.indexOf(item) == index;
  //   }
  // });

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  let cpount = getRandomArbitrary(1, 9000);

  function getRandomArbitraryForLocals(min, max) {
    return Math.random() * (max - min) + min;
  }
  let localCounts = getRandomArbitraryForLocals(10000, 1000000000);

  console.log("FinalImageData", FinalImageData)

  return (
    <div className="h-auto w-full">
      {mainPromos && mainPromos.length > 0 ? <Carousel responsive={responsive}
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
        interval={5000}
        autoPlay={true}
        swipeScrollTolerance={1}
      >
        {FinalImageData.map((promo, index) => {
          // console.log("pro", promo)
          return <PromoCard key={`mainPromos-slide-${cpount}`} data={promo} size="small" className="mx-1" slideType='mainPromos' type="main" />;
        })}
      </Carousel> : ""}
      
      <TitleDivider
        title={'LOCAL PROMOS'}
        align="center"
        classNames={{ middleSpan: 'text-base' }}
      />

      {localPromos.length ? <Carousel responsive={responsive}
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
        interval={5000}
        autoPlay={true}
        swipeScrollTolerance={1}
      >
        {localPromos.map((promo, index) => {
          return (
            <PromoCard key={`mainPromos-slide-${localCounts}`} data={promo} size="small" className="mx-1" slideType='localPromos' type="local" />
          );
        })}
      </Carousel>

        : ''}
    </div>
  );
}
