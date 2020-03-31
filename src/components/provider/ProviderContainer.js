import React, { useEffect } from 'react';
import ProvidersTable from './ProvidersTable';
import axiosInstance from 'services/AxiosInstance';
import useProviderDataFieldStore from 'components/provider/useProviderDataFieldStore';
import { keyBy } from 'lodash';

import useAxios, { configure } from 'axios-hooks';

configure({
  axios: axiosInstance
})

export default function ProviderContainer() {
  const store = useProviderDataFieldStore();
  const {
    datafield: datafieldStore,
    provider: providerStore,
  } = store;

  const { typeEqualsProvider, typeEqualsTopic } = datafieldStore;

  const [{ data: providers = {} }] = useAxios(
    '/providers'
  );

  const [{ data: datafields = {} }] = useAxios(
    '/datafields?type=provider&type=topic'
  );

  useEffect(() => {
    providerStore.addMany(providers);
    datafieldStore.addMany(datafields);
  }, [providers, datafields]);

  const tableData = Object.values(providerStore.entities);
  const datafieldsData = Object.values(datafieldStore.entities);

  let topics = datafieldsData.filter(typeEqualsTopic);
    topics = keyBy(topics, 'id');

  let providerTypes = datafieldsData.filter(typeEqualsProvider);
    providerTypes = keyBy(providerTypes, 'id');

  return (
    <ProvidersTable 
        data={tableData}
        topics={topics}
        providerTypes={providerTypes}
        store={store}
    />
  ); 
}
