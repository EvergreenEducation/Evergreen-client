import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Tag, Button, Input, Form, message } from 'antd';
import {
  find,
  last,
  each,
  groupBy,
  sortBy,
  reject,
  flowRight,
  orderBy,
} from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faCalendarAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
// import SimpleReactLightbox from "simple-react-lightbox";
import { faHandshake } from '@fortawesome/free-regular-svg-icons';
import { reactLocalStorage } from 'reactjs-localstorage';
import dayjs from 'dayjs';
import axiosInstance from 'services/AxiosInstance';
import { LearnAndEarnIcons, UnitTag } from 'components/shared';
import useGlobalStore from 'store/GlobalStore';
import './info-layout.scss';
import 'assets/scss/antd-overrides.scss';
import {
  CollapsibleComponent,
  CollapsibleHead,
  CollapsibleContent
} from "react-collapsible-component";
// IMAGE
import PlayIcon from '../../../assets/img/play.png';

// CONSTANTS
const ALL_VIDEO_FORMAT_REGEX = (/\.(wmv|flv|mkv|mp4|webm|m4v|m4a|m4v|f4v|f4a|m4b|m4r|f4b|mov|3gp|3gp2|3g2|3gpp|3gpp2|ogg|oga|ogv|ogx|wmv|wma|mpg|mpeg)$/i);
const axios = require('axios').default;
var parse = require('html-react-parser');

// const location_type='';
export default function ({
  children,
  type,
  data = {},
  groupedDataFields,
  session = {},
}) {
  const [openCodeInput, setOpenCodeInput] = useState(false);
  const {
    id,
    cost,
    credit,
    pay,
    length,
    length_unit,
    frequency,
    frequency_unit,
    DataFields = [],
    Provider = { name: null, location: null },
    provider_id,
    name,
    is_public,
    industry,
    financial_aid,
    GroupsOfOffers = [],
    external_url,
    Pathways,
    learn_and_earn,
    description,
    rubric_attachment,
    main_image,
    accreditation,
    location_type,
    outlook,
  } = data;
  const [offerEnrollments, setOfferEnrollments] = useState([]);
  const [fetchEnrollments, setFetchEnrollments] = useState(false);
  const { offer: offerStore } = useGlobalStore();
  const [form] = Form.useForm();
  const myOfferEnrollments = sortBy(offerEnrollments, ['start_date']);
  // const [htmValue, setHtmlValue] = useState()
  const [outllokData, setOutLookData] = useState()
  const [imageData, setImageData] = useState({})
  const [isCheck, setIsCheck] = useState(false)
  // const [imagedata, setImageData] = useState()
  // const { Column } = Table;
  const getData = async (data) => {
    let id = data.id
    let Data = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/files/get_accedration/${id}`)
    return Data
  }

  useEffect(() => {
    const getAvailableEnrollmentByOffer = async (offerId) => {
      if (!fetchEnrollments) {
        const { data } = await axiosInstance.get(
          `/enrollments?status=Inactivate&student_id=null&offer_id=${offerId}`
        );
        if (!myOfferEnrollments.length) {
          setOfferEnrollments(data);
        }
      }
      setFetchEnrollments(true);
    };

    if (type === 'offer' && !fetchEnrollments && !myOfferEnrollments.length) {
      getAvailableEnrollmentByOffer(id);
    }
  }, []);
  useEffect(() => {
    Pathways && Pathways.length && Pathways.map(item => {
      setOutLookData(item.outlook)
    })
  }, []);
  // useEffect(() => {
  //   main_image && main_image.length && main_image.map(item => {
  //     let newItem = JSON.parse(item)
  //     setImageData(newItem)
  //   })
  // }, []);
  const handleLink = (itemnew) => {
    // console.log("texttttttt", itemnew)
    window.open(
      `${itemnew.original}`, "_blank");
  }
  useEffect(() => {
    getData(data).then(response => {
      if (response.status === 200) {
        // console.log('getData accrediation', response)
        setImageData(response.data.data)
        setIsCheck(true)
      }
    }).catch(error => {
      console.log(error, "errrrrrr")
    })
  }, []);

  const enrollOffer = async () => {
    const studentId = session.student_id;
    const offerId = id;
    try {
      const response = await axiosInstance.put(
        `/students/${studentId}/offers/${offerId}/provider/${provider_id}/enroll`,
        {
          start_date: dayjs().toISOString(),
        }
      );

      if (response.status === 200 && typeof response.data === 'string') {
        message.success(`You've already applied or enrolled in ${data.name}`);
        return response.data;
      }
      if (response.status === 200) {
        message.success(`You've enrolled in ${data.name}`);
      }
      if (response.status === 201) {
        message.info(
          `You've enrolled in ${data.name}. We will notify the provider`
        );
      }
      return response;
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const enrollPathway = async () => {
    const studentId = session.student_id;
    const pathwayId = id;
    try {
      const response = await axiosInstance.post(
        `/students/${studentId}/pathways/${pathwayId}/enroll`
      );
      if (response.status === 200) {
        message.info(`You're already enrolled in ${data.name}`);
      }
      if (response.status === 201) {
        message.success(`You've enrolled in ${data.name}`);
      }
      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  };

  const onEnroll = () => {
    if (!Object.keys(session).length) {
      if (type === 'offer') {
        reactLocalStorage.set('offer_id', id);
      }
      if (type === 'pathway') {
        reactLocalStorage.set('pathway_id', id);
      }
      return window.location.replace(`${process.env.REACT_APP_API_URL}/login`);
    }
    if (
      type === 'offer' &&
      Object.keys(session).length &&
      session.role === 'student'
    ) {
      return enrollOffer();
    }
    if (
      type === 'pathway' &&
      Object.keys(session).length &&
      session.role === 'student'
    ) {
      return enrollPathway();
    }
  };

  const topics = DataFields.filter((d) => d.type === 'topic');
  const offerCategory = find(DataFields, ['type', 'offer_category']);
  const lengthUnit = find(groupedDataFields.length_unit, ({ id }) => {
    return id === Number(length_unit);
  });
  const frequencyUnit = find(groupedDataFields.frequency_unit, ({ id }) => {
    return id === Number(frequency_unit);
  });

  let src = null;
  let alt = '';

  if (data && data.Files && data.Files.length) {
    const notBanners = flowRight([
      (f) => orderBy(f, ['createdAt', 'asc']),
      (f) => reject(f, ['meta', 'banner-image']),
    ])(data.Files);
    const { file_link, location: fileLocation } = last(notBanners);
    src = file_link;
    alt = fileLocation;
  }
  let totalPay = 0;
  let totalCredit = 0;
  let totalCost = 0;

  if (type === 'pathway') {
    const groups = groupBy(GroupsOfOffers, 'group_name');

    each(Object.values(groups), function (_group) {
      each(_group, function (o) {
        const offer = offerStore.entities[o.offer_id];
        if (offer) {
          if (offer.pay) {
            totalPay += offer.pay;
          }
          if (offer.credit) {
            totalCredit += offer.credit;
          }
          if (offer.cost) {
            totalCost += offer.cost;
          }
        }
      });
    });
  }

  const EnrollAndExternalUrlRow = (
    <Row
      className={`w-full mx-auto ${
        external_url ? 'justify-between' : 'justify-center'
        }`}
    >
      {/* {console.log("resp",data)} */}
      {!data.is_generic && <Button
        type="primary"
        className="rounded"
        style={{ width: '49%' }}
        onClick={() => onEnroll()}
      >
        Enroll
      </Button>}
      {external_url ? (
        <Button type="primary" className="rounded" style={{ width: '49%' }} onClick={() => {
          isValidURL(external_url)
        }}>
          View Website
        </Button>
        // <Button type="primary" className="rounded" style={{ width: '49%' }}>
        //   <a href={external_url} target="_blank" rel="noopener noreferrer external">
        //     View Website
        //   </a>
        // </Button>
      ) : null}

    </Row>
  );

  let locationText = data && data.location ? data.location : '---';

  if (type === 'provider' && data && data.location) {
    locationText = data.location;
  }

  if (
    (type === 'offer' || type === 'pathway') &&
    Provider &&
    Provider.location
  ) {
    locationText = Provider.location;
  }
  // console.log('locationText',locationText)

  // const handleHtml = (prop) => {
  //   if (prop === "bold") {
  //     setHtmlValue("bold")
  //   } else if (prop === "italic") {
  //     setHtmlValue("italic")
  //   }
  // }


  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  // var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  let [demo, setDemo] = useState()
  function handleDivmain(newItem) {
    setDemo(newItem)
    modal.style.display = "block";
  }
  function handleImgmain() {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  function handleSpanmain() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }


  const redirectToExternalLink = (url) => {
    window.open(
      `${url}`);
  }

  function isValidURL(string) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    let isUrlValid = regex.test(string)
    let fullUrl = isUrlValid ? '' : 'https://' + string;
    redirectToExternalLink(fullUrl)
  };

  let Arr = []
  let newArr = location_type.map(item => {
    if(item === "Online"){
     Arr.push({name:"Self-learning",img:"/icons/online.png" })

    } if(item === "Hybrid"){
      Arr.push({name:"Self-learning",img:"/icons/hybrid.png" })
 
     }
    else if(item === "Self-learning"){
      Arr.push({name:"Self-learning",img:"/icons/self-learning.png" })

    }else if(item === "In-person"){
      Arr.push({name:"In-person",img:"/icons/in-person.png" })

    }else if(item === "Social Distancing Confirmed"){
      Arr.push({name:"In-person",img:"/icons/social-distancing.png" })
    }
    console.log("aaaaaaaaaaa",Arr)
  })
  // let Arr = JSON.parse(main_image)
  return (
    <div className="infoLayout">
      <header className="mx-auto relative" style={{ minHeight: 52 }}>
        <span
          className="block text-white text-center text-lg absolute text-white w-full bottom-0 p-3"
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            borderTopLeftRadius: !src ? '1rem' : 'none',
            borderTopRightRadius: !src ? '1rem' : 'none',
          }}
        >
          {name || '---'}
        </span>
        {src && (
          <figure className="mx-auto">
            <img className="h-full w-full object-cover" src={src} alt={alt} />
          </figure>
        )}
      </header>
      <section
        className="bg-white px-2 pb-4"
        style={{
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem',
        }}
      >
        <Col>
          <Carousel showArrows={true} >
            {main_image && main_image.length && main_image.map(item => {
              let newItem = JSON.parse(item),
                // getting file sxtension like abc.mp4 here mp4 is retreived
                fileExtension = newItem.name.slice((Math.max(0, newItem.name.lastIndexOf(".")) || Infinity) + 1),
                // adding . in front of mp4
                finalExtension = '.' + fileExtension,
                // checking if format match with our all video format
                checkType = ALL_VIDEO_FORMAT_REGEX.test(finalExtension);
              // let checkType = newItem.name.toString().endsWith("mp4");
              if (checkType) {
                return (
                  <div className="modal_block" id="myBtn" onClick={() => handleDivmain(newItem)}>
                    
                    <div className="play_btn">
                        <img src={PlayIcon} alt="PlayIcon"/>
                      </div>
                    <video>
                      {/*accept="video/mp4,video/wmv,video/flv,video/mkv,video/mp4,video/webm,video/ogg"*/}
                      <source src={newItem.original} accept={`video/${fileExtension}`} onClick={() => handleImgmain(newItem)} />
                    </video>
                  </div>)
              } else {
                return (
                  <div className="modal_block" id="myBtn" onClick={() => handleDivmain(newItem)}>
                    <img src={newItem.original} onClick={() => handleImgmain(newItem)} alt="" />
                  </div>)
              }
            })}
          </Carousel>
        </Col>

        <div id="myModal" className="modal" >
          <div className="modal-content">
            <span className="close" onClick={() => handleSpanmain()}>&times;</span>
            {/*  demo.name.toString().endsWith("mp4") ? */}
            {demo && ALL_VIDEO_FORMAT_REGEX.test('.' + demo.name.slice((Math.max(0, demo.name.lastIndexOf(".")) || Infinity) + 1)) ?
              <video controls>
                {/*  accept="video/mp4,video/wmv,video/flv,video/mkv,video/mp4,video/webm,video/ogg"  */}
                <source src={demo.original} accept={`video/${demo.name.slice((Math.max(0, demo.name.lastIndexOf(".")) || Infinity) + 1)}`} />
              </video> : <img src={demo ? demo.original : null} alt="" />}
          </div>
        </div>
        <Row className="py-2">
          <Col span={12}>
            {type === 'provider' ? (
              <span>{industry}</span>
            ) : provider_id ? (
              <Link
                className={provider_id ? '' : 'pointer-events-none'}
                to={`/home/provider/${provider_id}`}
              >
                {Provider.name ? Provider.name : ''}
              </Link>
            ) : null}
          </Col>
          <Col span={12} className="flex flex-row-reverse items-center">
            <span className="block ml-1">{locationText}</span>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </Col>
        </Row>
        <hr />
        <Row className="py-2">
          <Col span={12} className="flex items-center earn_btn">
            <LearnAndEarnIcons learnAndEarn={data.learn_and_earn} />
            <div className="accreditation_block">{accreditation ?
              <p>Accreditation: {accreditation} </p>
              : null}</div>
          </Col>
          <Col span={12} className="flex flex-col items-right text-right">
            <span className="text-gray-600">TOPICS</span>
            <div className="flex flex-row-reverse flex-wrap items-right">
              {topics.map((t, index) => {
                if (t.type !== 'topic') {
                  return null;
                }
                return (
                  <Tag
                    className="mr-0 ml-1 mb-1"
                    color={index % 2 ? 'blue' : 'orange'}
                    key={index.toString()}
                  >
                    {t.name}
                  </Tag>
                );
              })}
            </div>
          </Col>
        </Row>
        <hr />
        <Row className="mt-2 mb-1">
          <Col span={8}>
            Cost :{' '}
            {type === 'pathway'
              ? totalCost
                ? `$${totalCost.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`
                : '---'
              : cost
                ? `$${cost.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`
                : '---'}
          </Col>
          {/* {console.log("cccccccccc", credit, pay, learn_and_earn)} */}
          {learn_and_earn === "learn" &&
            <Col span={8} className="flex justify-center">
              {type === "offer" || type === "provider" ? "Credit : " : null}
              {type === "provider" && credit >= 0 || credit === "yes" ? "yes" : null}
              {/* {type === 'pathway' && totalCredit.toLocaleString() || null} */}
              {type === 'offer' && (credit && credit.toLocaleString()) || null}
            </Col>}
          {learn_and_earn === "earn" &&
            <Col span={8} className="flex flex-row-reverse justify-center">
              {type === "offer" || type === "provider" ? "Pay : " : null}
              {type === "provider" && pay >= 0 || pay === "yes" ? "yes" : null}
              {/* {type === 'pathway' && totalCredit.toLocaleString() || null} */}
              {type === 'offer' && (pay && pay.toLocaleString()) || null}
            </Col>
          }
          {learn_and_earn === "both" &&
            <>
              <Col span={8} className="flex justify-center">
                {type === "offer" || type === "provider" ? "Credit : " : null}
                {type === "provider" && credit >= 0 || credit === "yes" ? "yes" : null}
                {/* {type === 'pathway' && totalCredit.toLocaleString() || null} */}
                {type === 'offer' && (credit && credit.toLocaleString()) || null}
              </Col>
              <Col span={8} className="flex flex-row-reverse">
                {type === "offer" || type === "provider" ? "Pay : " : null}
                {type === "provider" && credit >= 0 || credit === "yes" ? "yes" : null}
                {/* {type === 'pathway' && totalCredit.toLocaleString() || null} */}
                {type === 'offer' && (pay && pay.toLocaleString()) || null}
              </Col>
            </>
          }
          {/* {learn_and_earn === "both" &&
            <div>
              <Col span={8} className="flex justify-center">
                Credit :{' '}
                {type === 'pathway'
                  ? totalCredit.toLocaleString() || '---'
                  : (credit && credit.toLocaleString()) || '---'}
              </Col>
              <Col span={8} className="flex flex-row-reverse">
                Pay :{' '}
                {type === 'pathway'
                  ? totalPay
                    ? `$${totalPay.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`
                    : '---'
                  : pay
                    ? `$${pay.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`
                    : '---'}
              </Col>
            </div>
          } */}
        </Row>

        <Row className="mt-1 mb-2  outlook offer_info">
          <Col span={8} className="flex flex-row items-center unitTags">
            {type !== 'provider' && length && (
              <UnitTag number={length} unit={lengthUnit} />
            )}
            {type !== 'provider' && frequency && (
              <UnitTag number={frequency} unit={frequencyUnit} />
            )}
            {type === 'provider' && (
              <>
                <span><FontAwesomeIcon icon={faHandshake} className="mr-1" /> {financial_aid}</span>
              </>
            )}
          </Col>
          {Arr && Arr.length ? Arr.map(item => {
            console.log("item",item)
            return (
            <p className="new-data-icons"><img className="social_distancing" src={item.img} alt="" /><span className="location_name">{item.name}</span></p>
            )
          }): null}
         
          {type === 'provider' &&
            myOfferEnrollments &&
            myOfferEnrollments.length ?
            <Col span={8} className="flex flex-row-reverse items-center">
              {type === 'provider' ? (
                <Tag className="mr-0" color="purple">
                  {is_public ? 'Public' : 'Private'}
                </Tag>
              ) : null}
              {(type === 'offer' &&
                myOfferEnrollments &&
                myOfferEnrollments.length && (
                  <>
                    <span className="ml-1">
                      {dayjs(last(myOfferEnrollments).start_date).format(
                        'MMM D, YYYY'
                      ) || null}
                    </span>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </>
                )) ||
                null}
            </Col> : ''}
          {outlook === undefined || outlook === null || outlook === '' ?
            <Col span={8} className={`${outlook === undefined || outlook === null || outlook === '' ? '' : 'flex-row-reverse'} flex  items-center`}>
              {type == "pathway" && <p>10yr job outlook: {outllokData} </p>}
            </Col> :
            <Col span={8} className={`${outlook === undefined || outlook === null || outlook === '' ? '' : 'flex-row-reverse'} flex  items-center`}>
              {type == "pathway" && <p>10yr job outlook: {imageData.outlook} </p>}
            </Col>}
          {/* {
            location ? <p>Location: {location}</p> : ''
          } */}
        </Row>
        <hr />
        <section className="font_type">

          {/* <p className="text-center break-words">{htmValue === "bold" ? <b>{data.description}</b> : <i>{data.description}</i>}</p> */}
          <p>
            {description ? description !== null ? parse(data.description) : null : ''}</p>
          {type === 'offer' && (
            <Tag className="mx-auto">
              {offerCategory ? offerCategory.name : null}
            </Tag>
          )}
        </section>
        <div>
          {type === 'provider' && external_url ? (
            <div className="flex justify-center w-full">
              <Button type="primary" className="rounded w-1/2">
                <a
                  href={external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Website
                </a>
              </Button>
            </div>
          ) : null}
          {type === 'pathway' && (
            <Row
              className={`flex-col mt-2 ${
                external_url
                  ? 'items-start justify-left'
                  : 'justify-center items-center'
                }`}
            >
              {EnrollAndExternalUrlRow}
            </Row>
          )}
          {type === 'offer' && (
            <Form form={form}>
              <Row
                className={`flex-col mt-2 ${
                  external_url
                    ? 'items-start justify-left'
                    : 'justify-center items-center'
                  }`}
              >
                {EnrollAndExternalUrlRow}
                {openCodeInput && (
                  <Row
                    className={`${external_url ? 'w-full' : 'w-1/2'} ${
                      openCodeInput ? 'mt-2' : ''
                      }`}
                  >
                    <Col span={external_url ? 22 : 20}>
                      <Form.Item
                        name="activation_code"
                        rules={[
                          {
                            required: true,
                            message: 'Requires code',
                          },
                        ]}
                      >
                        <Input
                          className="flex items-center rounded-l rounded-r-none ant-input-group-add-on-border-none-p-0"
                          style={{ paddingBottom: 4.5, zIndex: 2 }}
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col span={external_url ? 2 : 4}>
                      <Button
                        className={`rounded-l-none rounded-r`}
                        onClick={() => setOpenCodeInput(false)}
                        icon={<FontAwesomeIcon icon={faTimes} />}
                      />
                    </Col>
                  </Row>
                )}
                {!openCodeInput && !data.is_generic && (
                  <Button
                    className={external_url ? 'pl-0' : ''}
                    type="link"
                    onClick={() => setOpenCodeInput(!openCodeInput)}
                  >
                    Already have code?
                  </Button>
                )}
              </Row>
            </Form>
          )}
        </div>
      </section>
      <section>
        {rubric_attachment === undefined || rubric_attachment === null ? '' : rubric_attachment.length ? <div className="pdf-listings">
          <Button ref={imageData} />
          <CollapsibleComponent>
            <CollapsibleHead className="additionalClassForHead">
              Rubric/Attachments
            </CollapsibleHead>
            {isCheck ? <CollapsibleContent className="additionalClassForContent">
              <div>
                {/* <p>Pdf list</p> */}
                {rubric_attachment === null ? '' : rubric_attachment.length ? rubric_attachment.map(item => {
                  // console.log("------", JSON.parse(item))
                  let itemnew = JSON.parse(item)
                  return (
                    // <p>{itemnew.original}</p>
                    <button className="pdf-listing-btn" onClick={() => handleLink(itemnew)}>{itemnew.name}</button>
                  )
                }) : ''}
              </div>
            </CollapsibleContent> : null}
          </CollapsibleComponent>
        </div> : ''}
      </section>
      <section>{children}</section>
      {/* {console.log(",,,,,,,,,", children)} */}

    </div>
  );
}
