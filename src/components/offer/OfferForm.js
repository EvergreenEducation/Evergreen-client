import React, { useState, useEffect } from 'react';
import {
  Layout,
  Form,
  Input,
  Row,
  Col,
  Select,
  InputNumber,
  Checkbox,
  Avatar
} from 'antd';
import { ImageUploadFunction } from 'components/shared';
import { PdfUploadFunction } from 'components/shared'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { groupBy, property, isNil, remove, compact } from 'lodash';
import 'assets/scss/antd-overrides.scss';
// import { AliwangwangOutlined } from 'antd';

const axios = require('axios').default;

const { Option } = Select;

const preloadOptions = (data = []) =>
data && data.length && data.map((item, index) => {
    return (
      <Option value={item.id} key={index.toString()}>
        {item.name}
      </Option>
    );
  });

const preloadOptionsOffer = (data = []) =>
data.map((item, index) => {
  return (
    <Option value={item.id} key={index.toString()}>
      {item.name}
    </Option>
  );
});

    // <Option value={`${item.id}`} key={index.toString()}

export default function OfferForm({
  datafields = [],
  providers = {},
  offers = [],
  offer = {},
  role,
  handlePropData,
  handleImageData,
  handleBannerImage,
  handleUpadteMain,
  handleUpadteBanner,
  handleDescriptionValue,
  descriptionValue,
  getOffersList
}) {

  providers = compact(Object.values(providers));
  datafields = Object.values(datafields);

  const grouped = groupBy(datafields, property('type'));
  // const grouped = groupBy(datafields, property('type'));
  const {
    offer_category = [],
    payment_unit = [],
    length_unit = [],
    credit_unit = [],
    topic = [],
    frequency_unit = [],
    cost_unit = [],
  } = grouped;

  let offerOptions = null;
  console.log('offer updated modal',offer)

  if (!isNil(offers) && offers.length) {
    const updatedOffers = remove(offers, (o) => {
      return !(o.id === offer.id);
    });
    console.log('updatedOffers...',updatedOffers)
    offerOptions = preloadOptions(updatedOffers);
  }
  
  const [getvalues, setGetValues] = useState([])
  const getData = async () => {
    let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/get_generic`)
    return pdfData
  }
  // console.log('providerStore.entities', providers)

  const deleteData = async (item1, offer) => {
    // console.log(offer, item1, "=============")
    let image = item1.original
    let user_id = offer.id
    let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/offer_delete_pdf`, {
      image,
      user_id
    })
    return pdfData
  }
  useEffect(() => {
    getData().then(resp => {
      // console.log(resp)
      if (resp.status == 200) {
        setGetValues(resp.data.data)
      }
    })
  }, [])
  // console.log("getvalues", getvalues, offer)
  // const [getPdfUrl, setGetPdfUrl] = useState()
  const [hideFied, setHideFied] = useState(true)
  const [isCheckLearn, setIsCheckLearn] = useState(true)
  const [isCheckEarn, setIsCheckEarn] = useState(true)
  const handlePdfData = (getPdfUrl, type) => {
    if (Object.keys(offer).length !== 0) {
      var result = offer.rubric_attachment.reduce(function (prev, value) {
        var isDuplicate = false;
        for (var i = 0; i < getPdfUrl.length; i++) {
          if (value == getPdfUrl[i]) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          prev.push(value);
        }

        return prev;

      }, []);
      let finaldata = result.map(item => JSON.parse(item))
      let testData = (finaldata.concat(getPdfUrl))

      var resArr = [];
      testData.forEach(function (item) {
        var i = resArr.findIndex(x => x.name == item.name);
        if (i <= -1) {
          resArr.push({ name: item.name, original: item.original });
        }
      });
      // setGetPdfUrl(getPdfUrl)
      handlePropData(getPdfUrl, resArr)
    } else {
      // console.log("inssssssssss")
      // setGetPdfUrl(getPdfUrl)
      handlePropData(getPdfUrl)
    }
  }
  const handleImageUrl = (getPdfUrl) => {
    // console.log("getPdfUrl", getPdfUrl)
    if (Object.keys(offer).length !== 0) {
      console.log("inssssssssssssss")
      var result = offer.main_image.reduce(function (prev, value) {
        var isDuplicate = false;
        for (var i = 0; i < getPdfUrl.length; i++) {
          if (value == getPdfUrl[i]) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          prev.push(value);
        }

        return prev;

      }, []);
      let finaldata = result.map(item => JSON.parse(item))
      let testData = (finaldata.concat(getPdfUrl))

      var resArr = [];
      testData.forEach(function (item) {
        var i = resArr.findIndex(x => x.name == item.name);
        if (i <= -1) {
          resArr.push({ name: item.name, original: item.original });
        }
      });
      // setGetPdfUrl(getPdfUrl)
      handleUpadteMain(getPdfUrl, resArr)
    } else {
      // setGetPdfUrl(getPdfUrl)
      handleImageData(getPdfUrl)
      // handleBannerImage(getPdfUrl)
    }
  }
  const BannerUploadFunction = (getPdfUrl) => {
    // console.log("aaaaaaaaaaaaaaaaaaaaaa", getPdfUrl)
    if (Object.keys(offer).length !== 0) {
      var result = offer.banner_image.reduce(function (prev, value) {
        var isDuplicate = false;
        for (var i = 0; i < getPdfUrl.length; i++) {
          if (value == getPdfUrl[i]) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          prev.push(value);
        }

        return prev;

      }, []);
      let finaldata = result.map(item => JSON.parse(item))
      let testData = (finaldata.concat(getPdfUrl))

      var resArr = [];
      testData.forEach(function (item) {
        var i = resArr.findIndex(x => x.name == item.name);
        if (i <= -1) {
          resArr.push({ name: item.name, original: item.original });
        }
      });
      // setGetPdfUrl(getPdfUrl)
      handleUpadteBanner(getPdfUrl, resArr)
    } else {
      // setGetPdfUrl(getPdfUrl)
      // handleImageData(getPdfUrl)
      handleBannerImage(getPdfUrl)
    }
  }
  // console.log("offreeee", offer)
 

  let offerOptiondata = null
  if (!isNil(offers) && offers.length) {
    const updatedOffers = remove(offers, (o) => {
      return !(o.name === offer.name);
    });
    console.log('preloadOptionsOffer...',updatedOffers)
    offerOptiondata = preloadOptionsOffer(updatedOffers);
  }

let preRequestOffers=null;
  if(getOffersList && getOffersList.length){
    console.log('getOffersList...',getOffersList)
    // const updatedOffers = remove(getOffersList, (o) => {
    //   console.log('!(o.name === offer.name)',!(o.name === getOffersList.name))
    //   console.log('o.name',o.name,getOffersList.name)
    //   return !(o.name === getOffersList.name);
    // });
    // console.log('preRequestOffers updatedOffers...',updatedOffers)
    preRequestOffers = preloadOptionsOffer(getOffersList);
  }

  // if (!isNil(offers) && offers.length) {
  //   const updatedOffers = remove(offers, (o) => {
  //     return !(o.name === offer.name);
  //   });
  //   offerOptions = preloadOptionsOffer(updatedOffers);
  // }

  const handleType = (event) => {
    if (event.target.checked == true) {
      setHideFied(false)
    } else if (event.target.checked == false) {
      setHideFied(true)
    }
  }

  const handlePdfDelete = (item1, offer) => {
    deleteData(item1, offer).then(resp => {
      // console.log("sucessssssss", resp)
    }).catch(error => {
      console.log("errro", error)
    })
  }
  const handleSelect = (e) => {
    console.log(e.target.textContent, "eeeeeeeeeeeeeee")
    if (e.target.textContent == "Learn") {
      setIsCheckEarn(false)
      setIsCheckLearn(true)
    } if (e.target.textContent == "Earn") {
      setIsCheckLearn(false)
      setIsCheckEarn(true)
    } if (e.target.textContent == "Learn and Earn") {
      setIsCheckEarn(true)
      setIsCheckLearn(true)
    }
  }
  useEffect(() => {
    console.log("offer=============",offer)
    if (offer && offer.learn_and_earn == "learn") {
      // console.log("eeeeeeeeeeeeeee")
      setIsCheckEarn(false)
      setIsCheckLearn(true)
    } if (offer && offer.learn_and_earn == "earn") {
      setIsCheckLearn(false)
      setIsCheckEarn(true)
    } if (offer  && offer.learn_and_earn == "both") {
      setIsCheckEarn(true)
      setIsCheckLearn(true)
    }
  }, [])
  // console.log("\n offer_category", offer_category)

  const handleChange = (e, editor) => {
    const data = editor.getData();
    handleDescriptionValue(data)
  }

  console.log('preRequestOffers', preRequestOffers)
  return (
    <Layout>
      {/* <ImageUploadAndNameInputs
        className="mb-2"
        userId={userId}
        onChangeUpload={onChangeUpload}
        onChangeBannerUpload={onChangeBannerUpload}
        file={file}
        bannerFile={bannerFile}
      >
      </ImageUploadAndNameInputs> */}
      <Col
        span={9}
        xs={24}
        sm={24}
        md={role === 'provider' ? 10 : 9}
        className="media-margin-top main_img"
      >
        <Form.Item
          label="Main Image"
          name="main_image"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit"
        >
          <ImageUploadFunction
            handleImageUrl={handleImageUrl}
            type="multiple" />
        </Form.Item>
        {offer && offer !== null ? <div>
          {offer && offer.main_image && offer.main_image.length ? <p>
            {offer.main_image && offer.main_image.map(item => {
              let item1 = JSON.parse(item)
              return (
                <div className="delete-pathway">
                  <p className=""></p>
                  <Avatar src={item1.original} alt={item1.name} />
                  <p>{item1.name}</p>
                </div>)
            })}
          </p> : null}
        </div> : null}
      </Col>
      <Col
        span={9}
        xs={24}
        sm={24}
        md={role === 'provider' ? 10 : 9}
        className="media-margin-top main_img"
      >
        <Form.Item
          label="Banner Image"
          name="banner_image"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit"
        >
          <ImageUploadFunction
            handleImageUrl={BannerUploadFunction}
            type="single" />
        </Form.Item>
        {offer && offer !== null ? <div>
          {offer && offer.banner_image && offer.banner_image.length ? <p>
            {offer.banner_image && offer.banner_image.map(item => {
              let item1 = JSON.parse(item)
              return (
                <div className="delete-pathway">
                  <p className=""></p>
                  <Avatar src={item1.original} alt={item1.name} />
                  <p>{item1.name}</p>
                </div>)
            })}
          </p> : null}
        </div> : null}
      </Col>
      {Object.keys(offer).length !== 0
        ? <div className="rubric_block">
          <Form.Item
            label="Rubric/Attachment"
            name={'rubric_attachment'}>
            <PdfUploadFunction
              handlePdfData={handlePdfData} />
          </Form.Item>
        </div> :
        <div className="rubric_block">
          <Form.Item
            label="Rubric/Attachment"
            name={'rubric_attachment'}>
            <PdfUploadFunction
              handlePdfData={handlePdfData} />
          </Form.Item>
        </div>}
      {offer && offer !== null ? <div>
        {offer && offer.rubric_attachment && offer.rubric_attachment.length ? <p>
          {offer.rubric_attachment && offer.rubric_attachment.map(item => {
            let item1 = JSON.parse(item)
            return (
              <div className="delete-pathway">
                <p className="delete-avatar" onClick={() => handlePdfDelete(item1, offer)}>X</p>
                <Avatar src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" />
                <p>{item1.name}</p>
              </div>)
          })}
        </p> : null}
      </div> : null}
      {/* <ImageUploadFunction /> */}

      <Row gutter={8}>
        <Col xs={24} sm={24} md={8}>
          <Form.Item
            label="Name"
            name="name"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input name="name" className="rounded" />
          </Form.Item>
        </Col>
        <Col
          className={role === 'provider' ? 'hidden' : ''}
          xs={24}
          sm={24}
          md={8}
        >
          <div className="flex flex-row">
            <Form.Item
              label="Provider"
              name="provider_id"
              labelAlign={'left'}
              colon={false}
              className="mb-0 inherit flex-col w-full"
            >
              <Select
                className="custom-select-rounded-l-r-none"
                showSearch
                name="provider_id"
              >
                {!isNil(providers) && providers.length
                  ? preloadOptions(providers)
                  : null}
              </Select>
            </Form.Item>
          </div>
        </Col>

        <Col
          span={9}
          xs={24}
          sm={8}
          md={role === 'provider' ? 10 : 8}
          className="media-margin-top"
        >
          <Form.Item
            label="Offer Type"
            name="category"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[
              { required: true, message: 'Please select a generic offer' },
            ]}
          >
            <Select className="rounded custom-select" name="category">
              {!isNil(offer_category) && offer_category.length
                ? preloadOptions(offer_category)
                : null}
            </Select>
          </Form.Item>
        </Col>

        {role === "admin" ? <Col xs={9} sm={24} md={8}>
          <Form.Item
            label="Add as Generic Offer"
            name="is_generic"
            colon={true}
            labelAlign={'left'}
            className="mt-2 mb-0 inherit"
            valuePropName="checked"
          >
            <Checkbox onChange={(event) => handleType(event)}
              defaultChecked={true}>Click here</Checkbox>
          </Form.Item>
        </Col> : null}
        {hideFied ? <Col
          span={9}
          xs={24}
          sm={24}
          md={role === 'provider' ? 10 : 9}
          className="media-margin-top"
        >
          <Form.Item
            label="Generic Offer"
            name="generic_type"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            {role == "admin" ? <Select className="rounded custom-select" name="generic_type" defaultValue={offer.generic_type}>
              {!isNil(getvalues) && getvalues.length
                ? preloadOptions(getvalues)
                : null}
            </Select> : <Select className="rounded custom-select" name="generic_type" defaultValue={offer.generic_type}>
                {!isNil(getvalues) && getvalues.length
                  ? preloadOptions(getvalues)
                  : null}
              </Select>}
          </Form.Item>
        </Col> : null}
      </Row>
      <Row gutter={8}>
        <Col span={24}>
          <Form.Item
            label="Keywords"
            name="keywords"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <Input className="rounded" />
          </Form.Item>
        </Col>
      </Row>
      <Col>
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          Description
        </span>
        <Form.Item
          name="description"
          labelAlign={'left'}
          colon={false}
          className="inherit"
          // rules={[{ required: true, message: 'Please provide a description' }]}
        >
          {/* <Input.TextArea rows={4} className="rounded" /> */}
          <CKEditor editor={ClassicEditor} data={descriptionValue} onChange={handleChange} />
        </Form.Item>
      </Col>
      <Row className="items-center mb-0">
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          Related Offers
        </span>
        <Form.Item name="related_offers" className="w-full">
          <Select
            className="w-full rounded custom-select"
            showSearch
            mode="multiple"
          >
            {preRequestOffers &&preRequestOffers.length? preRequestOffers:   offerOptions && offerOptions.length && offerOptions}
            {/* {preRequestOffers && preRequestOffers.length && preRequestOffers} */}
          </Select>
        </Form.Item>
      </Row>
      <Row className="items-center mb-0">
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          Prerequisites
        </span>
        <Form.Item name="prerequisites" className="w-full">
          <Select
            className="w-full rounded custom-select"
            showSearch
            mode="multiple"
          >
            {preRequestOffers &&preRequestOffers.length? preRequestOffers:   offerOptions && offerOptions.length && offerOptions}
          </Select>
        </Form.Item>
      </Row>
      <Row className="items-center mb-0">
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          Topics
        </span>
        <Form.Item name="topics" className="w-full">
          <Select showSearch className="w-full custom-select" mode="multiple">
            {!isNil(topic) && topic.length ? preloadOptions(topic) : null}
          </Select>
        </Form.Item>
      </Row>
      <Row className="items-center mb-0 mt-2">
        <Col xs={24} sm={24} md={8}>
          <Form.Item
            label="Location Type"
            name="location_type"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            // rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select name="location_type" className="custom-select" mode="multiple">
              <Option value="Online"><img className="social_distancing" src="/icons/online.png" alt="" /> Online</Option>
              <Option value="Hybrid"><img className="social_distancing" src="/icons/hybrid.png" alt="" /> Hybrid</Option>
              <Option value="In-person"><img className="social_distancing" src="/icons/in-person.png" alt="" /> In person</Option>
              <Option value="Self-learning"><img className="social_distancing" src="/icons/self-learning.png" alt="" /> Self Learning</Option>
              <Option value="Social Distancing Confirmed"><img className="social_distancing" src="/icons/social-distancing.png" alt="" />Social Distancing Confirmed</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Learn/Earn"
            name="learn_and_earn"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            // rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select className="rounded custom-select" onClick={(e) => handleSelect(e)}>
              <Option className="learn" value="learn">Learn</Option>
              <Option className="earn" value="earn">Earn</Option>
              <Option value="both">Learn and Earn</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Frequency"
            name="frequency"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            // rules={[{ required: true, message: 'Please fill in this field' }]}
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Frequency Unit"
            name="frequency_unit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            // rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select className="rounded custom-select">
              {!isNil(frequency_unit) && frequency_unit.length
                ? preloadOptions(frequency_unit)
                : null}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Cost"
            name="cost"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            // rules={[{ required: true, message: 'Please fill in this field' }]}
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Cost Unit"
            name="cost_unit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <Select className="rounded custom-select">
              {!isNil(cost_unit) && cost_unit.length
                ? preloadOptions(cost_unit)
                : null}
            </Select>
          </Form.Item>
        </Col>
        {isCheckLearn && <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Credit"
            name="credit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            
            // rules={[{ required: true, message: 'Please fill in this field' }]}
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>}
        {isCheckLearn && <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Credit Unit"
            name="credit_unit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            // rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select className="rounded custom-select">
              {!isNil(credit_unit) && credit_unit.length
                ? preloadOptions(credit_unit)
                : null}
            </Select>
          </Form.Item>
        </Col>}
      </Row>
      <Row gutter={8}>
        {isCheckEarn && <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Pay"
            name="pay"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            // rules={[{ required: true, message: 'Please fill in this field' }]}
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>}
        {isCheckEarn && <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Pay Unit"
            name="pay_unit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            // rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select className="rounded custom-select">
              {!isNil(payment_unit) && payment_unit.length
                ? preloadOptions(payment_unit)
                : null}
            </Select>
          </Form.Item>
        </Col>}
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Length"
            name="length"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Length Unit"
            name="length_unit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <Select className="rounded custom-select">
              {!isNil(length_unit) && length_unit.length
                ? preloadOptions(length_unit)
                : null}
            </Select>
          </Form.Item>
        </Col>
        <Col className="mt-2 mb-0" span={24}>
          <span className="text-gray-700 relative" style={{ bottom: 2 }}>
            External URL
          </span>
          <Form.Item
            name="external_url"
            labelAlign={'left'}
            colon={false}
            className="inherit mb-0"
          >
            <Input className="rounded" />
          </Form.Item>
        </Col>
        {(role === 'admin' && (
          <Row className="w-full relative" style={{ left: '0.4em' }}>
            <Col xs={24} sm={24} md={6}>
              <Form.Item
                name="is_local_promo"
                labelAlign={'left'}
                colon={false}
                className="mt-2 mb-0 inherit"
                valuePropName="checked"
              >
                <Checkbox defaultChecked={false}>Local Promo</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6}>
              <Form.Item
                name="is_main_promo"
                labelAlign={'left'}
                colon={false}
                className="mt-2 mb-0 inherit"
                valuePropName="checked"
              >
                <Checkbox defaultChecked={false}>Main Promo</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        )) ||
          null}
      </Row>
    </Layout>
  );
}