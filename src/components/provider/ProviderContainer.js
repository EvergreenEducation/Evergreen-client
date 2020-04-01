import React, { useEffect, useState } from 'react';
import axiosInstance from 'services/AxiosInstance';
import useAxios, { configure } from 'axios-hooks';
import { Card } from 'antd';
import { imported } from 'react-imported-component/macro';
import { ProvidersTable, useProviderDataFieldStore } from 'components/provider';
const ProviderUpdateModal = imported(() => import('components/provider/ProviderUpdateModal'));

configure({
  axios: axiosInstance
})

export default function ProviderContainer() {
  const [ modalVisibility, setModalVisibility ] = useState(false);
  const [ selectedProvider, setSelectedProvider ] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;

  const [{ data = {}, loading }] = useAxios(
    '/providers?scope=with_datafields'
  );

  const [{ data: datafieldsData = {}, loading: loadingDataFields }] = useAxios(
    '/datafields?type=provider&type=topic'
  );

  const openAndPopulateUpdateModal = (provider) => {
    setSelectedProvider(provider);
    setModalVisibility(true);
  }

  useEffect(() => {
    provider.addMany(data);
    datafield.addMany(datafieldsData);
  }, [data, datafieldsData]);

  const entities = Object.values(provider.entities);

  return (
    <Card className="shadow-md rounded-md">
      <ProvidersTable
          data={entities}
          store={store}
          loading={loading && loadingDataFields}
          datafields={Object.values(datafield.entities)}
          handleUpdateModal={openAndPopulateUpdateModal}
      />
      <ProviderUpdateModal
        datafields={Object.values(datafield.entities)}
        provider={selectedProvider}
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        store={store}
      />
    </Card>
  ); 
}
