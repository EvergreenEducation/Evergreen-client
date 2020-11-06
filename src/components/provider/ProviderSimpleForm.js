import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Row, Col, Avatar, Select } from 'antd';
import {  ImageUploadFunction } from 'components/shared';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'assets/scss/antd-overrides.scss';
import {  isNil } from 'lodash';

import { getindustryData } from 'components/datafield/IndustryContainer'

const { Option } = Select;

const ProviderSimpleForm = (props) => {
  const {
    handleData = {}, handleUpadteMain,
    handleUpadteBanner, role,
  } = props;
  // const [getPdfUrl, setGetPdfUrl] = useState()
// console.log(' handleUpadteMain handleUpadteBanner', handleUpadteMain,handleUpadteBanner)

  const handleChange = (e, editor) => {
    const data = editor.getData();
    props.handleChange(data)
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
      // handleImageData(getPdfUrl)
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
      // handleBannerImage(getPdfUrl)
    }
  }
  const [indusData, setIndusData] = useState()

  let industryOptions = null;

  if (!isNil(indusData) && indusData.length) {
    industryOptions = indusData.map(({ name, id }, index) => (
      <Option value={name} key={index.toString()}>
        {name}
      </Option>
    ));
  }

  useEffect(() => {
    getindustryData().then(resp => {
      // console.log(resp, "111111111111111111")
      if (resp.status == 200) {
        setIndusData(resp.data.data)
      }
    }).catch(error => {
      console.log(error, "error")
    })
  }, []);


  return (
    <Layout>
      {/* <ImageUploadAndNameInputs
        className="mb-2"
        userId={userId}
        onChangeUpload={onChangeUpload}
        file={file}
        onChangeBannerUpload={onChangeBannerUpload}
        // bannerFile={getBannerImage}
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
      <Row gutter={8}>
        <Col xs={12} sm={12} md={12}>
          <Form.Item
            label="Location"
            name="location"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
            rules={[{ required: true, message: 'Please enter a location' }]}
          >
            <Input name="location" className="rounded" />
          </Form.Item>
        </Col>
        <Row className="items-center mb-0 mt-2">
          <span className="text-gray-700 relative" style={{ bottom: 2 }}>
            Industry
        </span>
          <Form.Item name="industry" className="w-full">
            <Select showSearch className="w-full custom-select" mode="">
              {industryOptions}
            </Select>
          </Form.Item>
        </Row>
        {/* <Col xs={12} sm={12} md={12}>
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
      <Row gutter={8}>
        <Col span={24}>
          <Form.Item
            label="Description"
            name="description"
            labelAlign={'left'}
            colon={false}
            className="mb-0 inherit"
          >
            <CKEditor editor={ClassicEditor} data={props.descriptionValue} onChange={handleChange} />
            {/* <Input className="rounded" /> */}
          </Form.Item>
        </Col>
      </Row>
      {/* </ImageUploadAndNameInputs> */}
    </Layout>
  );
};

export default ProviderSimpleForm;
