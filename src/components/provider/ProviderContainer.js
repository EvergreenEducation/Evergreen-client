import React, { useEffect, useState } from 'react';
import axiosInstance from 'services/AxiosInstance';
import useAxios, { configure } from 'axios-hooks';
import { Card, Layout, Col } from 'antd';
import { imported } from 'react-imported-component/macro';
import { ProvidersTable } from 'components/provider';
import useGlobalStore from 'store/GlobalStore';
import {
  SearchHeader,
  LogOutTopbar,
  FaPlusCircleButton,
} from 'components/shared';
// import matchSorter from 'match-sorter';
const axios = require('axios').default;

const ProviderUpdateModal = imported(() =>
  import('components/provider/ProviderUpdateModal')
);

const FormModal = imported(() => import('components/shared/FormModal'));
const ProviderCreationContainer = imported(() =>
  import('components/provider/ProviderCreationContainer')
);

configure({
  axios: axiosInstance,
});

const { Content } = Layout;

export default function ProviderContainer(props) {
  const { history, role } = props;
  // console.log("sdsds",props)
  const [searchString, setSearchString] = useState('');
  const [modalStates, setModalStates] = useState({
    providerCreation: false,
    providerUpdate: false,
  });
  const [selectedProvider, setSelectedProvider] = useState({});
  const [providersData, setProvidersData] = useState([]);
  // const [providerError,setProviderError]=useState[''];
  const { datafield, provider, provider: providerStore } = useGlobalStore();
  // data = []
  const [{ data = [], loading, error: providerError }] = useAxios('/providers?scope=with_details');

  const [{ data: datafieldsData, loading: loadingDataFields, error: datafieldError }] = useAxios('/datafields?type=provider&type=topic');

  const getPdfData = async (provider) => {
    let user_id = provider.id
    let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/delete_provider`, {
      user_id
    })
    return pdfData
  }

  const openAndPopulateUpdateModal = (provider) => {
    setSelectedProvider(provider);
    setModalStates({ ...modalStates, providerUpdate: true });
  };

  let DeletedValue = false
  const handleDeleteModal = (provider) => {
    setSelectedProvider(provider);
    DeletedValue = true
    if (DeletedValue) {
      providerStore.removeOne(provider)
      getPdfData(provider).then(resp => {
        getProviderApi()
        // console.log(resp,"ressssssssss")
      }).catch(error => {
        console.log("error", error)
      })
    }
    // setModalStates({ ...modalStates, providerUpdate: true });
  };

  // getting Provider List from provider api
  function getProviderApi() {
    getProviderList().then(res => {
      setProvidersData(res.data)
    }).catch(err => {
      console.log('errr', err)
      // setProviderError(err)
    })
  }


  const getProviderList = async () => {
    let Data = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/providers?scope=with_details`)
    return Data
  }

  if (providerError || datafieldError) {
    history.push('/error/500');
  }

  useEffect(() => {
    if (data) {
      provider.addMany(data);
    }
    if (datafieldsData) {
      datafield.addMany(datafieldsData);
    }
  }, [data, datafieldsData]);

  // const entities = Object.values(provider.entities);
  const dataFieldEntities = Object.values(datafield.entities);

  // const handleDataAfterSearch = (data, keys = ['name', 'keywords']) => {
  //   return matchSorter(data, searchString, { keys });
  // };

  const handleDataSearch = (searchVal) => {
    return setSearchString(searchVal);
  };

  // const showData = handleDataAfterSearch(entities);

  useEffect(() => {
    getProviderApi()
  }, [])

  return (
    <Layout className="bg-transparent">
      <LogOutTopbar>
        <Col span={14}>
          <SearchHeader title="PROVIDERS" onSearch={handleDataSearch}>
            <FaPlusCircleButton
              onMouseEnter={() => {
                FormModal.preload();
                ProviderCreationContainer.preload();
              }}
              onClick={() =>
                setModalStates({ ...modalStates, providerCreation: true })
              }
              text="PROVIDER"
            />
          </SearchHeader>
        </Col>
      </LogOutTopbar>
      <Content className="p-6">
        <Card className="shadow-md rounded-md">
          <ProvidersTable
            // data={providerError ? [] : showData}
            data={providersData}
            loading={loading && loadingDataFields}
            datafields={datafieldError ? [] : dataFieldEntities}
            handleUpdateModal={openAndPopulateUpdateModal}
            handleDeleteModal={handleDeleteModal}
          />
          <ProviderUpdateModal
            role={role}
            datafields={datafieldError ? [] : dataFieldEntities}
            provider={selectedProvider}
            visible={modalStates.providerUpdate}
            getProviderApi={getProviderApi}
            onCancel={() =>
              setModalStates({ ...modalStates, providerUpdate: false })
            }
          />
          <FormModal
            role={role}
            title="New Provider"
            visible={modalStates.providerCreation}
            FormComponent={ProviderCreationContainer}
            getProviderApi={getProviderApi}
            onCancel={() =>
              setModalStates({ ...modalStates, providerCreation: false })
            }
          />
        </Card>
      </Content>
    </Layout>
  );
}
