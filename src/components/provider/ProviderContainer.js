import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from 'services/AxiosInstance';
import useAxios, { configure } from 'axios-hooks';
import { Card } from 'antd';
import { imported } from 'react-imported-component/macro';
import { ProvidersTable, useProviderDataFieldStore } from 'components/provider';
const ProviderUpdateModal = imported(() => import('components/provider/ProviderUpdateModal'));

configure({
  axios: axiosInstance
})

export default function ProviderContainer({ handleTableData }) {
  const history = useHistory();
  const [ modalVisibility, setModalVisibility ] = useState(false);
  const [ selectedProvider, setSelectedProvider ] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;

  const [{
    data = [],
    loading,
    error: providerError,
  }] = useAxios('/providers?scope=with_details');

  const [{
    data: datafieldsData,
    loading: loadingDataFields,
    error: datafieldError,
  }] = useAxios('/datafields?type=provider&type=topic');

  const openAndPopulateUpdateModal = (provider) => {
    setSelectedProvider(provider);
    setModalVisibility(true);
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

  const entities = Object.values(provider.entities);
  const dataFieldEntities = Object.values(datafield.entities);

  const showData = handleTableData(entities);

  return (
    <Card className="shadow-md rounded-md">
      <ProvidersTable
          data={providerError ? [] : showData}
          store={store}
          loading={loading && loadingDataFields}
          datafields={datafieldError ? [] : dataFieldEntities}
          handleUpdateModal={openAndPopulateUpdateModal}
      />
      <ProviderUpdateModal
        datafields={datafieldError ? [] : dataFieldEntities}
        provider={selectedProvider}
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        store={store}
      />
    </Card>
  ); 
}
