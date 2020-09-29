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
import { ToastContainer, toast } from 'react-toastify';
import { TitleDivider } from 'components/shared';
import { ImageUploadAndNameInputs, ImageUploadFunction, BannerUploadFunction } from 'components/shared';
import { PdfUploadFunction } from 'components/shared'
import { groupBy, property, isNil, compact } from 'lodash';
import 'assets/scss/antd-overrides.scss';
import OfferGroupTable from './OfferGroupTable/OfferGroupTable';
import { data } from 'autoprefixer';
import { getGenericData } from 'components/datafield/GenericContainer';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const axios = require('axios').default;

const { Option } = Select;

const preloadOptions = (data = []) =>
  data.map((item, index) => {
    return (
      <Option value={item.id} key={index.toString()}>
        {item.name}
      </Option>
    );
  });


export default function PathwayForm({
  datafields = [],
  groupsOfOffers = [],
  setGroupsOfOffers,
  userId = null,
  file,
  onChangeUpload,
  pathway,
  providers,
  role,
  form,
  onChangeBannerUpload,
  bannerFile,
  offerStore,
  handlePropData,
  handleImageData,
  handleBannerImage,
  handleUpadteMain,
  handleUpadteBanner,
  descriptionValue,
  handleDescriptionValue,
}) {
  toast.configure()
  providers = compact(providers);
  datafields = Object.values(datafields);
  const deleteData = async (item1, pathway) => {
    let image = item1.original
    let user_id = pathway.id
    let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/delete_pdf`, {
      image,
      user_id
    })
    return pdfData
  }
  const grouped = groupBy(datafields, property('type'));
  const { topic = [], frequency_unit = [] } = grouped;
  const [getPdfUrl, setGetPdfUrl] = useState()
  const [getDeleteValue, setDeleteValue] = useState()
  const [listingData, setListingData] = useState()

  console.log("pdflin------------------", getPdfUrl, pathway)

  useEffect(() => {
    getGenericData().then(resp => {
      // console.log(resp, "111111111111111111")
      if (resp.status == 200) {
        setListingData(resp.data.data)
      }
    }).catch(error => {
      console.log(error, "error")
    })
  }, []);

  const handlePdfData = (getPdfUrl) => {
    setGetPdfUrl(getPdfUrl)
    if (pathway && pathway.rubric_attachment.length) {
      var result = pathway.rubric_attachment.reduce(function (prev, value) {

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
      handlePropData(getPdfUrl, resArr)
      // setDeleteValue(getDeleteValue)
    } else {
      handlePropData(getPdfUrl)
    }
  }
  const handleImageUrl = (getPdfUrl) => {
    console.log("getPdfUrl", getPdfUrl)
    if (pathway && pathway.main_image.length) {
      var result = pathway.main_image.reduce(function (prev, value) {
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
      setGetPdfUrl(getPdfUrl)
      handleUpadteMain(getPdfUrl, resArr)
    } else {
      setGetPdfUrl(getPdfUrl)
      handleImageData(getPdfUrl)
      // handleBannerImage(getPdfUrl)
    }
  }

  const BannerUploadFunction = (getPdfUrl) => {
    console.log("getPdfUrl", getPdfUrl)
    if (pathway && pathway.banner_image.length) {
      var result = pathway.banner_image.reduce(function (prev, value) {
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
      setGetPdfUrl(getPdfUrl)
      handleUpadteBanner(getPdfUrl, resArr)
    } else {
      setGetPdfUrl(getPdfUrl)
      // handleImageData(getPdfUrl)
      handleBannerImage(getPdfUrl)
    }
  }

  const handlePdfDelete = (item1, pathway) => {
    deleteData(item1, pathway).then(resp => {
      console.log("sucessssssss", resp)
      if (resp.status == 200) {
        // notify("success")
        setDeleteValue(resp.data.data)
      }
    }).catch(error => {
      console.log("errro", error)
      notify("network")
    })
  }

  const notify = msg => {
    if (msg == "success") {
      toast.success("Data Save Successfully")
    } else if (msg == "netork") {
      toast.network("Network error Please check again")
    }
  }

  let listingOptions = null;
  if (!isNil(listingData) && listingData.length) {
    listingOptions = listingData.map(({ name, id }, index) => (
      <Option value={name} key={index.toString()}>
        {name}
      </Option>
    ));
  }

  const handleChange = (e, editor) => {
    const data = editor.getData();
    handleDescriptionValue(data)
  }
  // console.log("getUrl", pathway, getPdfUrl)
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
            handleImageUrl={handleImageUrl} />
        </Form.Item>
        {pathway && pathway !== null ? <div>
          {pathway && pathway.main_image && pathway.main_image.length ? <p>
            {pathway.main_image && pathway.main_image.map(item => {
              let item1 = JSON.parse(item)
              return (
                <div class="delete-pathway">
                  <p class=""></p>
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
            handleImageUrl={BannerUploadFunction} />
        </Form.Item>
        {pathway && pathway !== null ? <div>
          {pathway && pathway.banner_image && pathway.banner_image.length ? <p>
            {pathway.banner_image && pathway.banner_image.map(item => {
              let item1 = JSON.parse(item)
              return (
                <div class="delete-pathway">
                  <p class=""></p>
                  <Avatar src={item1.original} alt={item1.name} />
                  <p>{item1.name}</p>
                </div>)
            })}
          </p> : null}
        </div> : null}
      </Col>
      <Form.Item
        label="Description"
        name="description"
        labelAlign={'left'}
        colon={false}
        className="mb-0 inherit"
        rules={[{ required: true, message: 'Please fill in this field' }]}
      >
        <CKEditor editor={ClassicEditor} data={descriptionValue} onChange={handleChange} />
        {/* <Input.TextArea className="rounded" rows={2} /> */}
      </Form.Item>
      {pathway && pathway !== null ? <div className="rubric_block">
        <Form.Item
          label="Rubric/Attachment"
          name={'rubric_attachment'}>
          <PdfUploadFunction
            handlePdfData={handlePdfData}
          />
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
      {pathway && pathway !== null ? <div>
        {pathway && pathway.rubric_attachment && pathway.rubric_attachment.length ? <p>
          {pathway.rubric_attachment && pathway.rubric_attachment.map(item => {
            let item1 = JSON.parse(item)
            return (
              <div class="delete-pathway">
                <p class="delete-avatar" onClick={() => handlePdfDelete(item1, pathway)}>X</p>
                <Avatar src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" />
                <p>{item1.name}</p>
              </div>)
          })}
        </p> : null}
      </div> : null}
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
      {/* </ImageUploadAndNameInputs> */}
      <TitleDivider className="add_offers" title={'Add Offers Group'} />
      <Row>
        <Col xs={24} sm={24} md={18}>
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
      </Row>
      <Row className="offsers_Table">
        <OfferGroupTable
          offerStore={offerStore}
          pathway={pathway}
          groupsOfOffers={groupsOfOffers}
          setGroupsOfOffers={setGroupsOfOffers}
          form={form}
        />
        <div
          className="w-full mb-4"
          style={{
            backgroundColor: '#e2e8f0',
            height: '1px',
          }}
        />
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
            rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select name="location_type" className="custom-select">
              <Option value="online">Online</Option>
              <Option value="hybrid">Hybrid</Option>
              <Option value="in-person">In person</Option>
              <Option value="self-learning'">Self Learning</Option>
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
            rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Select className="rounded custom-select">
              <Option value="learn">Learn</Option>
              <Option value="earn">Earn</Option>
              <Option value="both">Learn and Earn</Option>
            </Select>
          </Form.Item>
        </Col>
        {/* <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Generic Type"
            name="type"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please fill in this field' }]}
          >
            <Input className="rounded" />
          </Form.Item>
        </Col> */}
        <Row className="items-center mb-0 mt-2">
          <span className="text-gray-700 relative" style={{ bottom: 2 }}>
            Generic Type
        </span>
          <Form.Item name="type" className="w-full">
            <Select showSearch className="w-full custom-select" mode="">
              {listingOptions}
            </Select>
          </Form.Item>
        </Row>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Earnings"
            name="earnings"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <Input className="rounded" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Frequency"
            name="frequency"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
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
          >
            <Select className="rounded custom-select">
              {!isNil(frequency_unit) && frequency_unit.length
                ? preloadOptions(frequency_unit)
                : null}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Outlook"
            name="outlook"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <Input className="rounded" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12} className={role === 'provider' ? 'hidden' : ''}>
          <Form.Item
            label="Provider"
            name="provider_id"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit flex-col w-full"
          >
            <Select
              className={`custom-select-rounded-l-r-none`}
              showSearch
              name="provider_id"
            >
              {!isNil(providers) && providers.length
                ? preloadOptions(providers)
                : null}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Col className="mt-2 mb-0">
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
      {
        (role === 'admin' && (
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
        null
      }
    </Layout >
  );
}
