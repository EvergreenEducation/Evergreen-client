import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'antd';
import {
  compact, groupBy, property
} from 'lodash';
import useGlobalStore from 'store/GlobalStore';
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { InfoCard } from 'components/student';
import { TitleDivider } from 'components/shared';
import 'assets/scss/responsive-carousel-override.scss';
import * as _ from 'underscore';


export default function (props) {
  const { getDataFields, getPathways, getOffers, getProviders,activePageId } = props;
  const [currentTopic, setCurrentTopic] = useState(null);
  const { datafield, offer: offerStore, pathway: PathwayStore } = useGlobalStore();

  const [selectedOfferData, setSelectedOfferData] = useState([]);
  const [selectedOutlookData, setSelectedOutlookData] = useState([]);
  const [selectedEarningData, setSelectedEarningData] = useState([]);
  const [selectedTopicId,setSelectedTopicId]=useState([]);
  const [activeTopicId,setActiveTopicId]=useState('')

  const topics = compact(
    Object.values(datafield.entities).filter((d) => d.type === 'topic')
  );
  const outlook = compact(
    Object.values(datafield.entities).filter((d) => d.type === 'provider')
  );

  topics.push({ name: 'Others' });
  outlook.push({ name: 'Others' });

  const groupedDataFields = groupBy(datafield.entities, property('type'));

  const handleChange = (e) => {
    if (selectedTopicId.length) {
      let { id } = selectedTopicId[e];
      getUpdatedOfferData(id)
    }
  };

// saving selected data when topic is change
  function getUpdatedOfferData(id) {
    let offerData = getOfferData(id),
      earningData = getEarningData(id),
      outlookData = getOutlookData(id);
      setSelectedOfferData(offerData);
      setSelectedEarningData(earningData);
      setSelectedOutlookData(outlookData);
      setActiveTopicId(id);
      setCurrentTopic(id);
  }

// getting and saving offerdata when next topic is choose
  function getOfferData(id) {
    let offerArray = [];
    if (getOffers && getOffers.length) {
      for (let i = 0; i < getOffers.length; i++) {
        for (let j = 0; j < getOffers[i].DataFields.length; j++) {
          if (getOffers[i].DataFields[j].id === id && getOffers[i].DataFields[j].is_check_topic === true && getOffers[i].DataFields[j].page_id.includes(activePageId.id)) {
            let offerObj = getOffers[i]
            offerArray.push(offerObj)
          }
        }
      }
    }
    return offerArray
  }

// getting and saving earning data when next topic is choose
  function getEarningData(id) {
    let earningArray = [];
    
    if (getPathways && getPathways.length) {
      for (let i = 0; i < getPathways.length; i++) {
        for (let j = 0; j < getPathways[i].DataFields.length; j++) {
          if (getPathways[i].DataFields[j].id === id && getPathways[i].DataFields[j].is_check_topic === true&& getPathways[i].DataFields[j].page_id.includes(activePageId.id)) {
            console.log(' getPathways[i]', getPathways[i])
            let offerObj = getPathways[i]
            earningArray.push(offerObj)
          }
        }
      }
    }
    return earningArray
  }

// getting and saving outlook data when next topic is choose
  function getOutlookData(id) {
    let outlookArray=[];
    if(getPathways && getPathways.length){
      for(let i=0;i<getPathways.length;i++){
        for(let j=0;j<getPathways[i].DataFields.length;j++){
          if(getPathways[i].DataFields[j].id === id &&getPathways[i].DataFields[j].is_check_topic === true && getPathways[i].DataFields[j].page_id.includes(activePageId.id)){
            let offerObj=getPathways[i]
            outlookArray.push(offerObj)
          }
        }
      }
    }
    return outlookArray
  }

    
// console.log("getDataFields",getDataFields)

// saving active Topic List
  function getSelectedTopicList(){
    let filterData;
    if(getDataFields){
      filterData=getDataFields && getDataFields.filter(item => item.is_check_topic === true && item.page_id.includes(activePageId.id));
      if(filterData.length){
        getUpdatedOfferData(filterData[0].id)
        setSelectedTopicId(filterData)
      }
   
    }
  }

  const handleCurrentItem = (current, total) => {
    // const index = current - 1;
    // setTimeout(() => {
    //   if (onCurrentChange !== current) {
    //     setOnCurrentChange(current);
    //   }
    //   if (onCurrentChange !== current) {
    //     setCurrentTopic(topics[index]);
    //   }
    // }, 50);
    // return null;
  };

  const handleCurrentItemOutlook = (current, total) => {
    // const index = current - 1;
    // setTimeout(() => {
    //   if (onCurrentChange !== current) {
    //     setOnCurrentChange(current);
    //   }
    //   if (onCurrentChange !== current) {
    //     setCurrentTopic(outlook[index]);
    //   }
    // }, 50);
    // return null;
  };
  // let filterData = topics && topics.filter(item => item.is_check_topic === true);



  

  const renderArrowBtns = (
    onClickHandler,
    hasPrevOrNext,
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
          style={style}>
          <FontAwesomeIcon icon={icon} />
        </Button>
      )
    );
  };

  const hasNoTopics = (offer) => {
    const { DataFields = [] } = offer;
    for (let k = 0; k < DataFields.length; k++) {
      if (DataFields[k].type === 'topic') {
        return false;
      }
    }
    return true;
  };

  const hasNoTopicsOutlook = (pathway) => {
    const { DataFields = [] } = pathway;
    for (let k = 0; k < DataFields.length; k++) {
      if (DataFields[k].type === 'provider') {
        return false;
      }
    }
    return true;
  };

  const renderOffers = () => {
    let currentOffers = [];
    let offerId = null;
    let _offers = compact(currentTopic.Offers);
    for (let i = 0; i < _offers.length; i++) {
      offerId = _offers[i].id;
      currentOffers.push(offerStore.entities[offerId]);
    }
    if (currentTopic.name === 'Others') {
      currentOffers = Object.values(offerStore.entities).filter(hasNoTopics);
    }
    return selectedOfferData.length? selectedOfferData.map((offer, index) => {
      // console.log('selectedOfferData', selectedOfferData)

      let p = null;
      if (offer && offer.provider_id && offer.Provider) {
        p = offer.Provider;
      }
      return offer.DataFields.length ? offer.DataFields.map((value, id) => {
        if (value.is_check_topic === true && value.id === activeTopicId) {
          return (
            <Link to={`/home/offer/${offer.id}`} key={index}>
              <InfoCard
                key={`renderOffers-${index}`}
                className="mx-auto mb-4 w-full"
                data={offer}
                provider={p}
                groupedDataFields={groupedDataFields}
                provider={offer.provider}
                outlook={offer.outlook}
                image={offer.rubric_attachment}
                earnings={offer.earnings}
                outEarvValue={true}
                bannerImage={offer.banner_image}
                mainImage={offer.main_image}
              />
            </Link>
          );
        }
      }) : false
    }):false;
  };

  function getOutlookCost(arr){
    if(arr.length){
      let cost ='',obj=[];
      for(let i=0;i<arr.length;i++){
         cost=calculateCost(arr[i].offer_id);
         obj.push(cost)
      }
      cost=obj.reduce(function(a, b) { return a + b; }, 0);
      return cost
    }else{
      return ''
    }

  }

  function getOutlookPay(arr){
    if(arr.length){
      let cost ='',obj=[];
      for(let i=0;i<arr.length;i++){
         cost=calculatePay(arr[i].offer_id);
         obj.push(cost)

      }
      cost=obj.reduce(function(a, b) { return a + b; }, 0);

      return cost
    }else{
      return ''
    }
  }

  function getOutlookCredit(arr){
    if(arr.length){
      let cost ='',obj=[];
      for(let i=0;i<arr.length;i++){
         cost=calculateCredit(arr[i].offer_id);
         obj.push(cost)

      }
      cost=obj.reduce(function(a, b) { return a + b; }, 0);

      return cost
    }else{
      return ''
    }
  }

  function calculatePay(id){
    // getting and saving offerdata when next topic is choose
    var cost = 0;
    if (getOffers && getOffers.length) {
      for (let i = 0; i < getOffers.length; i++) {
        if (getOffers[i].id === id){
          console.log('getOffers[i].cost',getOffers[i].cost,'getOffers[i].id',id,getOffers[i].id)
          let data=getOffers[i].pay?getOffers[i].pay:0;
          cost= data;
          console.log(' cost=cost + getOffers[i]',cost)
        }
      }
    }
    return cost
  }

  function calculateCredit(id){
    // getting and saving offerdata when next topic is choose
    var cost = 0;
    if (getOffers && getOffers.length) {
      for (let i = 0; i < getOffers.length; i++) {
        if (getOffers[i].id === id){
          console.log('getOffers[i].cost',getOffers[i].cost,'getOffers[i].id',id,getOffers[i].id)
          let data=getOffers[i].credit?getOffers[i].credit:0;
          cost= data;
          console.log(' cost=cost + getOffers[i]',cost)
        }
      }
    }
    return cost
  }



  function calculateCost(id){
    // getting and saving offerdata when next topic is choose
    var cost = 0,obj=[];
    if (getOffers && getOffers.length) {
      for (let i = 0; i < getOffers.length; i++) {
        if (getOffers[i].id === id){
          console.log('getOffers[i].cost',getOffers[i].cost,'getOffers[i].id',id,getOffers[i].id)
          let data=getOffers[i].cost?getOffers[i].cost:0;
          // cost+=getOffers[i].cost?getOffers[i].cost:0;
          // obj=getOffers[i].cost?getOffers[i].cost:0;
          // obj.push(data)
          cost=data
          // console.log(' cost=cost + getOffers[i]',obj)
        }
      }
    }


    return cost
  
  }

  const renderOffersOutlook = () => {
    let currentOf = [];
    let offerId = null;
    let _offers = compact(currentTopic.Offers);
    for (let i = 0; i < _offers.length; i++) {
      offerId = _offers[i].id;
      currentOf.push(PathwayStore.entities);
    }
    if (currentTopic.name === 'Others') {
      currentOf = Object.values(PathwayStore.entities)
    }
    console.log('Object.values(PathwayStore.entities)',Object.values(PathwayStore.entities))
    // currentOf = sortBy(currentOf, [{'outlook' : 'desc'}]);
    // currentOf.sort((a, b) => parseFloat(b.outlook) - parseFloat(a.outlook));
    selectedOutlookData.sort((a, b) => parseFloat(b.outlook) - parseFloat(a.outlook));
    return selectedOutlookData.map((offer, index) => {
      let OutlookCost=getOutlookCost(offer.GroupsOfOffers);
      let OutlookPay=getOutlookPay(offer.GroupsOfOffers);
      let OutlookCredit=getOutlookCredit(offer.GroupsOfOffers);


      let p = null;
      let outlook
      let earnings
      let image = []
      if (offer && offer.provider_id && offer.Provider) {
        p = offer.Provider;
        image = offer.rubric_attachment
        outlook = offer.outlook
        earnings = offer.earnings
      }
      // console.log('selectedOutlookData', selectedOutlookData)
      if (offer && offer.DataFields) {
        return offer.DataFields.length ? offer.DataFields.map((value, id) => {
          // console.log('offer.DataFields', value.is_check_topic)
          console.log('groupedDataFields',groupedDataFields ,'\n\nvalue',value)

          if (value.is_check_topic === true && value.id === activeTopicId) {
            return (
              <Link to={`/home/pathway/${offer.id}`} key={index} >
                <InfoCard
                  key={index}
                  className="mx-auto mb-4 w-full"
                  data={offer}
                  provider={offer.provider}
                  outlook={offer.outlook}
                  image={offer.rubric_attachment}
                  earnings={offer.earnings}
                  groupedDataFields={groupedDataFields}
                  outEarvValue={true}
                  bannerImage={offer.banner_image}
                  mainImage={offer.main_image}
                  GroupsOfOffers ={offer.GroupsOfOffers}
                  OutlookCost={OutlookCost}
                  OutlookPay={OutlookPay}
                  OutlookCredit={OutlookCredit}
                />
              </Link>
            );
          }
        }) : false
      } else {
        return false
      }
      // return offer && offer.DataFields ? :false
    });
  };

  const renderOffersEarning = () => {
    let currentOffers = [];
    let curOffers = []
    let offerId = null;
    let _offers = compact(currentTopic.Offers);

    for (let i = 0; i < _offers.length; i++) {
      offerId = _offers[i].id;
      currentOffers.push(PathwayStore.entities);
    }
    if (currentTopic.name === 'Others') {
      currentOffers = Object.values(PathwayStore.entities).filter(hasNoTopicsOutlook);
    }
    // currentOffers = sortBy(currentOffers, [{'earnings' : 'desc'}]);
    // currentOffers.sort((a, b) => parseFloat(b.earnings) - parseFloat(a.earnings));
    selectedEarningData.sort((a, b) => parseFloat(b.earnings) - parseFloat(a.earnings));

    return selectedEarningData.map((offer, index) => {
    let OutlookPay=getOutlookPay(offer.GroupsOfOffers);
      let testArr = []
      // let test = [offerStore.entities]
      let newData = offer.GroupsOfOffers.map(newDta => {
        curOffers.push(PathwayStore.entities);
        console.log("new",curOffers)
        // if(newDta.offer_id == test.id){
        // }

      })
      let OutlookCost=getOutlookCost(offer.GroupsOfOffers);
      let OutlookCredit=getOutlookCredit(offer.GroupsOfOffers);

      let p = null;
      let outlook = null
      let earnings = null
      let image = []
      let mainImage = []
      if (offer && offer.provider_id && offer.Provider) {
        p = offer.Provider;
        outlook = offer.outlook
        earnings = offer.earnings
        image = offer.rubric_attachment
        mainImage = offer.main_image
      }
      if (offer && offer.DataFields) {
        return offer.DataFields.length ? offer.DataFields.map((value, id) => {
          if (value.is_check_topic === true && value.id === activeTopicId) {
            return (
              <Link to={`/home/pathway/${offer.id}`} key={index}>
                <InfoCard
                  key={index}
                  className="mx-auto mb-4 w-full"
                  data={offer}
                  provider={offer.provider}
                  outlook={offer.outlook}
                  image={offer.rubric_attachment}
                  earnings={offer.earnings}
                  groupedDataFields={groupedDataFields}
                  outEarvValue={true}
                  bannerImage={offer.banner_image}
                  mainImage={offer.main_image}
                  GroupsOfOffers ={offer.GroupsOfOffers}
                  OutlookCost={OutlookCost}
                  OutlookPay={OutlookPay}
                  OutlookCredit={OutlookCredit}
                />
              </Link>
            );
          }
        }) : false
      } else {
        return false
      }
    });
  };

  useEffect(()=>{
    getSelectedTopicList()
  },[getDataFields,getPathways, getOffers, getProviders])
  // isUrlCustomPage
  return (
    <div className="width-95">
      <div className="h-auto w-full homepage_boxes">
        <TitleDivider
          title={'TOP OUTLOOKS'}
          align="right"
          classNames={{ middleSpan: 'text-base' }}
        />
        <Carousel
          className="custom-carousel mb-2 cursor-grab"
          centerMode
          infiniteLoop
          centerSlidePercentage={90}
          showArrows={true}
          showIndicators={false}
          swipeable={true}
          emulateTouch={true}
          onChange={handleChange}
          showStatus={true}
          statusFormatter={handleCurrentItemOutlook}
          showThumbs={false}
          renderArrowNext={(...rest) => {
            return renderArrowBtns(...rest, faArrowRight);
          }}
          renderArrowPrev={(...rest) => {
            return renderArrowBtns(...rest, faArrowLeft, { left: 15 });
          }}
          swipeScrollTolerance={1}
        >
          <Card
            className="mx-auto text-white text-lg w-auto flex justify-center items-center"
            style={{
              backgroundColor: 'rgb(7, 25, 80)',
              height: 50,
            }}
          // key={index}
          >
            {"Outlooks"}
          </Card>
        </Carousel>
        <main>{currentTopic && renderOffersOutlook()}</main>
      </div>
      <div className="h-auto w-full homepage_boxes">
        <TitleDivider
          title={'OFFERS BY TOPICS'}
          align="center"
          classNames={{ middleSpan: 'text-base' }}
        />
        <Carousel
          className="custom-carousel mb-2 cursor-grab"
          centerMode
          infiniteLoop
          centerSlidePercentage={90}
          showArrows={true}
          showIndicators={false}
          showStatus={true}
          statusFormatter={handleCurrentItem}
          onChange={handleChange}
          showThumbs={false}
          renderArrowNext={(...rest) => {
            return renderArrowBtns(...rest, faArrowRight);
          }}
          renderArrowPrev={(...rest) => {
            return renderArrowBtns(...rest, faArrowLeft, { left: 15 });
          }}
          swipeScrollTolerance={1}
        >
          {selectedTopicId.length? selectedTopicId.map((topic, index) => {
            if (topic.page_id.includes(activePageId.id)) {
              return (
                <Card
                  className="mx-auto text-white text-lg w-auto flex justify-center items-center"
                  style={{
                    backgroundColor: 'rgb(7, 25, 80)',
                    height: 50,
                  }}
                  key={index}
                // onClick={ha}
                >
                  {topic.name}
                </Card>
              );
            }
          }): <Card
          className="mx-auto text-white text-lg w-auto flex justify-center items-center"
          style={{
            backgroundColor: 'rgb(7, 25, 80)',
            height: 50,
          }}
        >
        No Data Available
        </Card>}
        </Carousel>
        <main>{currentTopic && renderOffers()}</main>
      </div>
      <div className="h-auto w-full homepage_boxes">
        <TitleDivider
          title={'TOP EARNING'}
          align="Left"
          classNames={{ middleSpan: 'text-base' }}
        />
        <Carousel
          className="custom-carousel mb-2 cursor-grab"
          centerMode
          infiniteLoop
          centerSlidePercentage={90}
          showArrows={true}
          showIndicators={false}
          swipeable={true}
          emulateTouch={true}
          onChange={handleChange}
          showStatus={true}
          statusFormatter={handleCurrentItemOutlook}
          showThumbs={false}
          renderArrowNext={(...rest) => {
            return renderArrowBtns(...rest, faArrowRight);
          }}
          renderArrowPrev={(...rest) => {
            return renderArrowBtns(...rest, faArrowLeft, { left: 15 });
          }}
          swipeScrollTolerance={1}
        >
          <Card
            className="mx-auto text-white text-lg w-auto flex justify-center items-center"
            style={{
              backgroundColor: 'rgb(7, 25, 80)',
              height: 50,
            }}
          // key={index}
          >
            {"Earning"}
          </Card>
        </Carousel>
        <main  className="width-95">{currentTopic && renderOffersEarning()}</main>
      </div>
    </div>
  );
}