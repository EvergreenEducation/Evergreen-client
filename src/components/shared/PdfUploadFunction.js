import React, {  useState } from 'react';
import { Layout,  Col, } from 'antd';
import 'assets/scss/antd-overrides.scss';
import {  toast } from 'react-toastify';
import Loader from 'react-loader-spinner'
const axios = require('axios').default;
toast.configure()

function PdfUploadFunction({ handlePdfData }) {
  const [inputFile, setInputFile] = useState({
    files: []
  })
  const [getValue,setValue]= useState()
  const [loader, setLoader] = useState()

  const onChangeUpload = (e) => {
    setLoader(true)
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
        handlePdfData(pdfItem)
        setValue(pdfItem)
        setLoader(false)
        // notify("success")
      }
    }).catch(error => {
      console.log(error, "pdf Uploaded error")
    })
  }
  const pdfFileData = async (inputFile) => {
    let fileData = inputFile
    // console.log("filesdataaaa",fileData)
    const data = new FormData();
    for (const File of fileData) {
      data.append('files', File);
    }
    let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/upload_pdf_file`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "*"
      }}
      )
    return pdfData
  }
  // const notify = msg => {
  //   if (msg == "error") {
  //     toast.error("Please select the pdf format")
  //   } else if (msg == "success") {
  //     toast.success("Pdf file upload successfully")
  //   }
  // }
  // console.log("pdfData", getValue)
  return (
    <Layout className="h-auto mb-6">
      <Col span={7} className="flex justify-end items-center">
        <div className='file-input'>
          <input multiple type='file' name="file" onChange={(e) => onChangeUpload(e, "files")} accept="application/pdf" />
          <span className='button'>Choose</span>
          <span className='label' data-js-label><label>{inputFile !== null ? inputFile.files.name : "Choose File"}</label></span>
        </div>
        {loader ?<Loader
          type="Circles"
          color="#00BFFF"
          height={100}
          width={100}
        /> : null}
        <div className="image_block_opportunity">
          {/* {console.log("ooooooooo",inputFile.files[1])} */}
         {getValue && getValue.length ? getValue.map((item,i) => {
          // console.log("iteeeeee",item)
          return (
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt={item.name}></img>
             )}):null}
          </div>
        {/* <button className="pdf_btn" onClick={() => handleButton()}>Upload PDF</button>  */}
      </Col>
    </Layout>
  );
}

export default PdfUploadFunction;
