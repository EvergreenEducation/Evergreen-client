import React, {} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Layout, Tooltip, Col } from 'antd';
import AuthService from 'services/AuthService';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import  { configure } from 'axios-hooks';
import {  toast } from 'react-toastify';
// const axios = require('axios').default;
toast.configure()
const { Header } = Layout;

configure({
  axios: axiosInstance,
});
// console.log("axiosInstance", axios)
export default function LogOutTopbar({ children, renderNextToLogOut }) {
  const { datafield } = useGlobalStore();
  // const { entities, typeEqualsProvider } = datafield;
  // const pdfData = Object.values(entities).filter(typeEqualsProvider);

var inputs = document.querySelectorAll('.file-input')

for (var i = 0, len = inputs.length; i < len; i++) {
  customInput(inputs[i])
}

function customInput (el) {
  const fileInput = el.querySelector('[type="file"]')
  const label = el.querySelector('[data-js-label]')
  
  fileInput.onchange =
  fileInput.onmouseout = function () {
    if (!fileInput.value) return
    
    var value = fileInput.value.replace(/^.*[\\\/]/, '')
    el.className += ' -chosen'
    label.innerText = value
  }
}

  return (
    <Header className="px-6 bg-white h-12 flex items-center">
      <Col span={17}>{children}</Col>
      <Col span={7} className="flex justify-end items-center">
        {renderNextToLogOut}
        <Button type="link" onClick={() => AuthService.logout()}>
          <Tooltip title="Sign out">
            <FontAwesomeIcon className="text-black" icon={faSignOutAlt} />
          </Tooltip>
        </Button>
      </Col>
    </Header>
  );
}

