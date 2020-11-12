import React, { useEffect, useState } from 'react';
import {
  Layout,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Select,
  Checkbox,
  Avatar
} from 'antd';
import { ImageUploadFunction } from 'components/shared';
import { groupBy, isNil } from 'lodash';
import 'assets/scss/antd-overrides.scss';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import InlineEditor from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import { getData } from 'components/datafield/AccedrationContainer';
import { getindustryData } from 'components/datafield/IndustryContainer'

const { Option } = Select;

const ProviderForm = (props) => {
  const {
    datafields = [],
    file,
    role,
    descriptionValue,
    handleImageData,
    handleBannerImage,
    handleUpadteMain,
    handleUpadteBanner,
    handleDescriptionValue,
    handleData = {},
  } = props;
  const [listingData, setListingData] = useState()
  const [indusData, setIndusData] = useState()
  // const [getPdfUrl, setGetPdfUrl] = useState()

  useEffect(() => { }, [props.datafields, file]);

  useEffect(() => {
    getData().then(resp => {
      // console.log(resp, "111111111111111111")
      if (resp.status === 200) {
        setListingData(resp.data.data)
      }
    }).catch(error => {
      console.log(error, "error")
    })
  }, []);

  useEffect(() => {
    getindustryData().then(resp => {
      // console.log(resp, "111111111111111111")
      if (resp.status === 200) {
        setIndusData(resp.data.data)
      }
    }).catch(error => {
      console.log(error, "error")
    })
  }, []);


  // console.log("handleData", handleData)
  const groupedDataFields = groupBy(datafields, 'type') || [];
  let { topic = [], provider = [] } = groupedDataFields;
  let providerTypeOptions = null;

  if (!isNil(provider) && provider.length) {
    providerTypeOptions = provider.map(({ name, id }, index) => {
      return (
        <Option value={id} key={index.toString()}>
          {name}
        </Option>
      );
    });
  }

  let topicOptions = null;

  if (!isNil(topic) && topic.length) {
    topicOptions = topic.map(({ name, id }, index) => (
      <Option value={id} key={index.toString()}>
        {name}
      </Option>
    ));
  }
  let listingOptions = null;

  if (!isNil(listingData) && listingData.length) {
    listingOptions = listingData.map(({ name, id }, index) => (
      <Option value={name} key={index.toString()}>
        {name}
      </Option>
    ));
  }

  let industryOptions = null;

  if (!isNil(indusData) && indusData.length) {
    industryOptions = indusData.map(({ name, id }, index) => (
      <Option value={name} key={index.toString()}>
        {name}
      </Option>
    ));
  }
  const handleImageUrl = (getPdfUrl) => {
    // console.log("getPdfUrl", getPdfUrl)
    if (Object.keys(handleData).length !== 0) {
      // console.log("inssssssssssssssssssssss")
      var result = handleData.main_image.reduce(function (prev, value) {
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
      // console.log("elseeeeeeeeeeee")
      // setGetPdfUrl(getPdfUrl)
      handleImageData(getPdfUrl)
      // handleBannerImage(getPdfUrl)
    }
  }
  const BannerUploadFunction = (getPdfUrl) => {
    // console.log("getPdfUrl", getPdfUrl)
    if (Object.keys(handleData).length !== 0) {
      var result = handleData.banner_image.reduce(function (prev, value) {
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
      // console.log("elseeeeeeeeeeee")
      // setGetPdfUrl(getPdfUrl)
      // handleImageData(getPdfUrl)
      handleBannerImage(getPdfUrl)
    }
  }

  const handleChange = (e, editor) => {
    const data = editor.getData();
    // console.log('handleChange data',data, Array.from( editor.ui.componentFactory.names()))
    handleDescriptionValue(data)
  }

  return (
    <Layout>
      {/* <ImageUploadAndNameInputs
        className="mb-2"
        userId={userId}
        onChangeUpload={onChangeUpload}
        onChangeBannerUpload={onChangeBannerUpload}
        file={file}
        bannerFile={bannerFile}
      > */}
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
        <div>
          {handleData && handleData.main_image && handleData.main_image.length ? <p>
            {handleData.main_image && handleData.main_image.map(item => {
              let item1 = JSON.parse(item)
              return (
                <div className="delete-pathway">
                  <p className=""></p>
                  <Avatar src={item1.original} alt={item1.name} />
                  <p>{item1.name}</p>
                </div>)
            })}
          </p> : null}
        </div>
      </Col>
      <Col
        span={9}
        xs={24}
        sm={24}
        md={role === 'provider' ? 10 : 9}
        className="media-margin-top main_img">
        <Form.Item
          label="Banner Image"
          name="banner_image"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit">
          <ImageUploadFunction
            handleImageUrl={BannerUploadFunction}
            type="single" />
        </Form.Item>
        {handleData && handleData !== null ? <div>
          {handleData && handleData.banner_image && handleData.banner_image.length ? <p>
            {handleData.banner_image && handleData.banner_image.map(item => {
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
      <Row gutter={8}>
      <Col xs={24} sm={24} md={8}>
          <Form.Item
            label="Name"
            name="name"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please enter a name' }]}>
            <Input name="name" className="rounded" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Form.Item
            label="Location"
            name="location"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please enter a location' }]}>
            <Input name="location" className="rounded" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Form.Item
            label="Type"
            name="type"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please select a type' }]}>
            <Select
              name="type"
              className="rounded custom-select"
              notFoundContent="No options available. Please create a provider type in settings.">
              {providerTypeOptions}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={8}>
          <Form.Item
            label="Learn/Earn"
            name="learn_and_earn"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please select an option' }]}>
            <Select name="learn_and_earn" className="custom-select">
              <Option value="learn">Learn</Option>
              <Option value="earn">Earn</Option>
              <Option value="both">Learn and Earn</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Form.Item
            label="Public/Private"
            name="is_public"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please select an option' }]}>
            <Select name="is_public" className="custom-select">
              <Option value={true}>Public</Option>
              <Option value={false}>Private</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8}>
        <Form.Item name="industry" className="w-full" label="Industry"   labelAlign={'left'}
            colon={false}
            className="mb-0 inherit">
          
          <Select showSearch className="w-full custom-select" mode="">
            {industryOptions}
          </Select>
        </Form.Item>
        </Col>
        {/* <Col xs={24} sm={24} md={8}>
          <Form.Item
            label="Industry"
            name="industry"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <Input name="industry" className="rounded" />
          </Form.Item>
        </Col> */}
      </Row>
      {/* </ImageUploadAndNameInputs> */}
      {/* <Col span={24}>
        <Form.Item
          label="Description"
          name="description"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit"
        >
          <Input className="rounded" />
        </Form.Item>
      </Col> */}
     
      <Col span={24}>
        <Form.Item
          label="Description"
          name="description"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit">
          <CKEditor
            editor={ClassicEditor}
            data={descriptionValue}
            onChange={handleChange} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Keywords"
          name="keywords"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit">
          <Input className="rounded" />
        </Form.Item>
      </Col>
      <Row className="items-center mb-0 mt-2">
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          Accreditation
        </span>
        <Form.Item name="accreditation" className="w-full">
          <Select showSearch className="w-full custom-select" mode="">
            {listingOptions}
          </Select>
        </Form.Item>
      </Row>
      <Row className="items-center mb-0 mt-2">
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          Topics
        </span>
        <Form.Item name="topics" className="w-full">
          <Select showSearch className="w-full custom-select" mode="multiple">
            {topicOptions}
          </Select>
        </Form.Item>
      </Row>
      <Row className="items-center mb-0 mt-2">
        <Col xs={24} sm={24} md={24}>
          <Form.Item
            label="Location Type"
            name="location_type"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please select an option' }]}>
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
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Financial Aid"
            name="financial_aid"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit">
            <Input className="rounded" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={4}>
          <Form.Item
            label="Cost"
            name="cost"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit">
            <InputNumber className="rounded w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={4}>
          {/* <Form.Item
            label="Pay"
            name="pay"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <InputNumber className="rounded w-full" />
          </Form.Item> */}
          <Form.Item
            label="Pay"
            name="pay"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit">
            <Select name="pay" className="custom-select">
              <Option value="yes">Yes</Option>
              <Option value="no">No</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={4}>
          {/* <Form.Item
            label="Credit"
            name="credit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <InputNumber className="rounded w-full" />
          </Form.Item> */}
          <Form.Item
            label="Credit"
            name="credit"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit">
            <Select name="credit" className="custom-select">
              <Option value="yes">Yes</Option>
              <Option value="no">No</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Col span={24}>
        <Form.Item
          label="News"
          name="news"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit">
          <Input className="rounded" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Contact"
          name="contact"
          labelAlign={'left'}
          colon={false}
          className="mb-0 inherit">
          <Input className="rounded" />
        </Form.Item>
      </Col>
      <Col className="mt-2 mb-0">
        <span className="text-gray-700 relative" style={{ bottom: 2 }}>
          External URL
        </span>
        <Form.Item
          name="external_url"
          labelAlign={'left'}
          colon={false}
          className="inherit mb-0">
          <Input className="rounded" />
        </Form.Item>
      </Col>
      {
        (role === 'admin' && (
          <Row className="w-full relative" style={{ left: '0.4em' }}>
            <Col xs={24} sm={24} md={6}>
              <Form.Item
                name="is_local_promo"
                labelAlign={'left'}
                colon={false}
                className="mt-2 mb-0 inherit"
                valuePropName="checked">
                <Checkbox defaultChecked={false}>Local Promo</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6}>
              <Form.Item
                name="is_main_promo"
                labelAlign={'left'}
                colon={false}
                className="mt-2 mb-0 inherit"
                valuePropName="checked">
                <Checkbox defaultChecked={false}>Main Promo</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        )) ||
        null
      }
    </Layout >
  );
};

export default ProviderForm;
