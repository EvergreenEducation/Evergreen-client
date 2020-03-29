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

    const [{ data = []}] = useAxios(
      '/providers'
    );

    useEffect(() => {
      store.addAll(data);
    }, [data]);

    return (
      <ProvidersTable 
        data={tableData}
      />
    ) 

}
