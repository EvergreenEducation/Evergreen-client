import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Input, Form, Upload, message, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import 'assets/scss/antd-overrides.scss';
import { ToastContainer, toast } from 'react-toastify';
const axios = require('axios').default;
toast.configure()

function BannerUploadFunction({handleImageUrl}) {
  const [inputFile, setInputFile] = useState({
    files: []
  })
  const[imageValue,setImageValue]=useState([])
  const onChangeUpload = (e) => {
    let emailvalue = { ...inputFile, files: e.target.files }
    setInputFile(emailvalue)
    if(e.target.files.length){
      handleButton(e.target.files)
    }
  }
  const handleButton = async (files) => {
    // console.log(files)
    await pdfFileData(files).then(async resp => {
      if (resp.status === 200) {
        // console.log(resp.data.data,"responssssssssssss")
        let pdfItem = resp.data.data
        handleImageUrl(pdfItem)
        setImageValue(pdfItem)
        // notify("success")
      }
    }).catch(error => {
      console.log(error, "erorrr")
    })
  }
  const pdfFileData = async (inputFile) => {
    let fileData = inputFile
    // console.log("filesdataaaa",fileData)
    const data = new FormData();
    for (const File of fileData) {
      data.append('files', File);
    }
    let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/upload_multiple_file`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "*"
      }
    })
    return pdfData
  }
  const notify = msg => {
    if (msg == "error") {
      toast.error("Please select the valid format")
    } else if (msg == "success") {
      toast.success("File upload successfully")
    }
  }
  // console.log("pdfData", imageValue)
  return (
    <Layout className="h-auto mb-6 opportunity_choose">
      <Col span={7} className="flex justify-end items-center">
        <div class='file-input'>
          <input multiple type='file' name="file" onChange={(e) => onChangeUpload(e, "files")} accept="image/*"  />
          <span class='button'>Choose</span>
          <span class='label' data-js-label><label>{inputFile !== null ? inputFile.files.name : "Choose File"}</label></span>
        </div>
        <div className="image_block_opportunity">
        {imageValue && imageValue.length > 0 ? imageValue.map((item,i) => {
          return (
          <img src={item.original} alt={item.name} />)}):null}
          </div>
      </Col>
    </Layout>
  );
}

export default BannerUploadFunction;
