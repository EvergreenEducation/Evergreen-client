import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Button, notification } from 'antd';
import ProviderSimpleForm from 'components/provider/ProviderSimpleForm';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import ProviderStore from 'store/Provider';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';
import 'assets/scss/antd-overrides.scss';
const axios = require('axios').default;

configure({
  axios: axiosInstance,
});


export default function ProviderSimpleUpdateModal(props) {
  const formRef = useRef(null);
  const providerStore = ProviderStore.useContainer();
  const { id: userId } = AuthService.currentSession;
  const [form] = Form.useForm();
  const { provider = {}, onCancel, visible } = props;

  const [file, setFile] = useState(null);

  const [descriptionValue, setDescriptionValue] = useState('')
  let token = JSON.parse(localStorage.getItem("currentSession"))
  let role = token.role;

  const onChangeUpload = (e) => {
    const { file } = e;
    if (file) {
      setFile(file);
    }
  };

  function populateFields(p) {
    form.setFieldsValue({
      name: p.name,
      location: p.location,
      description: p.description,
    });
  }

  useEffect(() => {
    if (formRef.current) {
      populateFields(provider);
    }

    // if (provider.Files) {
    //   const orderedFiles = orderBy(
    //     provider.Files,
    //     ['fileable_type', 'createdAt'],
    //     ['desc', 'desc']
    //   );
    //     if (orderedFiles[i].fileable_type === 'provider') {
    //       setFile(orderedFiles[i]);
    //       break;
    //     }
    //   }
  }
    , [props, provider, provider.Files, formRef]);

  const [createSimpleProvider] = useAxios(
    {
      url: `/providers/${provider.id}`,
      method: 'PUT',
    },
    { manual: true }
  );


  function updateFormAPI(url,data){
    let headers={};
    return new Promise((resolve, reject) => {
      axios.put(url, data, { headers }).then(res => {
          resolve(res)
      }).catch(err => {
          reject(err.response)
      })
  })
  }


  const submitUpdate = async () => {
    const values = await form.validateFields([
      'name',
      'location',
      'industry',
      'main_image',
      'banner_image',
      'description'
    ])
    // const values = form.getFieldsValue([
    //   'name',
    //   'location',
    //   'industry',
    //   'main_image',
    //   'banner_image',
    //   'description'
    // ]);

    try {
      // debugger

      let url=`${process.env.REACT_APP_API_URL}/api/v1/providers/${provider.id}`,
      data= {
        ...values,
        'main_image': getMainImage,
        'banner_image': getBannerImage,
        'description': descriptionValue
      };

      updateFormAPI(url,data).then(res=>{
        let {status,data}=res;

        if (status && status === 200) {
          providerStore.updateOne(data);
          // debugger
          if (data && file && userId) {
            // debugger
            const { name, type } = file;
            const results =  UploaderService.upload({
              name,
              mime_type: type,
              uploaded_by_user_id: userId,
              fileable_type: 'provider',
              fileable_id: data.id,
              binaryFile: file.originFileObj,
            });
            const providerEntity = providerStore.entities[data.id];
            providerEntity.Files.push({
              ...results.file.data,
            });
            providerStore.updateOne(providerEntity);
          }
          // debugger
          notification.success({
            message: status,
            description: 'Successfully updated provider',
          });
          getProviderData();
          onCancel();
        }
      }).catch(err=>{
        console.error(err);

      })





      // const [{ data, loading, error,status }] = await createSimpleProvider({
      //   data: {
      //     ...values,
      //     'main_image': getMainImage,
      //     'banner_image': getBannerImage,
      //     'description': descriptionValue
      //   },
      // });
      // debugger
      // const response = await axiosInstance.put(
      //   `/providers/${provider.id}`,
      //   data:{
      //     ...values,
      //     'main_image': getImageData,
      //     'banner_image': getBannerImage,
      //     'description': descriptionValue
      //   }
      // );
      
    } catch (e) {
      console.error(e);
    }
  };
  // hold description value in simple provider update modal
  const handleChange = (value) => {
    setDescriptionValue(value);
  }

  const [getMainImage, setGetMainImage] = useState()
  const [getBannerImage, setGetBannerImage] = useState()

  const handleUpadteMain = (getMainImage) => {
    setGetMainImage(getMainImage)
    // setDeleteValue(getDeleteValue)
  }
  const handleUpadteBanner = (getBannerImage) => {
    setGetBannerImage(getBannerImage)
    // setDeleteValue(getDeleteValue)
  }
  // getting fresh data from provider api
  const getProviderData = () => {
    getProviderApiData().then(res => {
      if (res.data) {
        providerStore.updateOne(res.data);
        props.getProviderInfo();
      }
    }).catch(err => {
      console.log('getProviderApiData error', err)
    })

  }
  // calling provider data api
  const getProviderApiData = async () => {
    let Data = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/providers/${provider.id}?scope=with_details`)
    return Data
  }

  // console.log("qqq", getMainImage, getBannerImage)

  return (
    <Modal
      forceRender={true}
      className="custom-modal"
      title={'Update Provider'}
      visible={visible}
      width={998}
      bodyStyle={{ backgroundColor: '#f0f2f5', padding: 0 }}
      footer={true}
      onCancel={onCancel}
      afterClose={() => {
        setFile(null);
      }}
    >
      <Form form={form} ref={formRef}>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '32rem' }}>
          <ProviderSimpleForm
            userId={userId}
            onChangeUpload={onChangeUpload}
            file={file}
            descriptionValue={descriptionValue}
            handleChange={handleChange}
            handleData={provider}
            handleUpadteMain={handleUpadteMain}
            handleUpadteBanner={handleUpadteBanner}
            role={role}
          />
        </div>
        <section
          className="bg-white px-6 pt-5 pb-1 flex justify-center"
          style={{
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Button
            className="mr-3 px-10 rounded"
            size="small"
            type="primary"
            htmlType="submit"
            onClick={() => submitUpdate()}
          >
            Update
          </Button>
          <Button
            className="px-10 rounded"
            size="small"
            type="dashed"
            onClick={() => onCancel()}
          >
            Cancel
          </Button>
        </section>
      </Form>
    </Modal>
  );
}