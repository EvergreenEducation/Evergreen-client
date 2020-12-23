import React, {  useState } from 'react';
import { Layout,  Col } from 'antd';
import 'assets/scss/antd-overrides.scss';
import {  toast } from 'react-toastify';
import Loader from 'react-loader-spinner'
// import Avatar from 'antd/lib/avatar/avatar';
const axios = require('axios').default;
toast.configure()

function ImageUploadFunction({ handleImageUrl,type }) {
  const [inputFile, setInputFile] = useState({
    files: []
  })
  const [loader, setLoader] = useState()
  const [imageValue, setImageValue] = useState([])
  const onChangeUpload = (e) => {
    setLoader(true)
    let emailvalue = { ...inputFile, files: e.target.files }
    setInputFile(emailvalue)
    if (e.target.files.length) {
      handleButton(e.target.files)
    }
  }
  const handleButton = async (files) => {
    // console.log(files)
    await pdfFileData(files).then(async resp => {
      if (resp.status === 200) {
        let pdfItem = resp.data.data
        console.log(pdfItem, "responssssssssssss")
         handleImageUrl(pdfItem)
         setImageValue(pdfItem)
        console.log(imageValue, "imageValue")
        setLoader(false)
        // notify("success")
      }
    }).catch(error => {
      console.log(error, "erorrr")
    })
  }
  const pdfFileData = async (inputFile) => {
    let fileData = inputFile
    // console.log("filesdataaaa", fileData)
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
  // const notify = msg => {
  //   if (msg == "error") {
  //     toast.error("Please select the valid format")
  //   } else if (msg == "success") {
  //     toast.success("File upload successfully")
  //   }
  // }
  console.log("imageValue", imageValue)
  return (
    <Layout className="h-auto mb-6 opportunity_choose">
      <Col span={7} className="flex justify-end items-center">
        <div className='file-input'>
          <input multiple={type==="multiple" ? true : false} type='file' name="file" onChange={(e) => onChangeUpload(e, "files")} accept={type=="multiple" ? "image/*,video/*" : "image/*"} />
          <span className='button'>Choose</span>
          <span className='label' data-js-label><label>{inputFile !== null ? inputFile.files.name : "Choose File"}</label></span>
        </div>
        {loader ? <Loader
          type="Circles"
          color="#00BFFF"
          height={100}
          width={100}
        /> : null}
        <div className="image_block_opportunity">
          {imageValue && imageValue.length > 0 ? imageValue.map((item, i) => {
            // console.log("oo", item)
            if (item.name.match(/(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/i)) {
              return (
                <img src={item.original} alt={item.name} />)
            } else {
              return (
                <video loop autoplay>
                  <source src={item.original} type="video/mp4" accept="video/*" />
                </video>
                )
            }
          }) : null}
        </div>
      </Col>
    </Layout>
  );
}

export default ImageUploadFunction;
