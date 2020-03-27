import React, { useEffect} from "react";
import ProvidersTable from './ProvidersTable';
import ProviderStore from 'store/Provider';
import axiosInstance from 'services/AxiosInstance';

import useAxios, { configure } from 'axios-hooks'

configure({
  axios: axiosInstance
})

export default function ProviderContainer() {
    const store = ProviderStore.useContainer();
    const { entities } = store;
    
    const tableData = Object.values(entities);

    const [{ data = [], loading, error }] = useAxios(
      '/providers'
    );

    useEffect(() => {
      store.addAll(data); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
      <ProvidersTable 
        data={tableData}
      />
    ) 

}
