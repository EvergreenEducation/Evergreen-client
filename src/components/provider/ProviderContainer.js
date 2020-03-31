import React, { useEffect} from "react";
import ProvidersTable from './ProvidersTable';
import axiosInstance from 'services/AxiosInstance';
import useProviderAndTypeStore from 'components/provider/useProviderAndTypeStore';
import { indexBy, prop } from 'ramda';

import useAxios, { configure } from 'axios-hooks'

configure({
  axios: axiosInstance
})

export default function ProviderContainer() {
    const store = useProviderAndTypeStore();
    const {
      type: typeStore,
      provider: providerStore,
    } = store;

    const { typeEqualsProvider, typeEqualsTopic } = typeStore;

    const [{ data: providers = {} }] = useAxios(
      '/providers'
    );

    const [{ data: datafields = {} }] = useAxios(
      '/datafields?type=provider&type=topic'
    );

    useEffect(() => {
    	providerStore.addMany(providers);
    	typeStore.addMany(datafields);
    }, [providers, datafields]);

    const tableData = Object.values(providers);
    const datafieldsData = Object.values(datafields);

    let topics = datafieldsData.filter(typeEqualsTopic);
      topics = indexBy(prop('id'), topics);

    let providerTypes = datafieldsData.filter(typeEqualsProvider);
    	providerTypes = indexBy(prop('id'), providerTypes);

    return (
    	<ProvidersTable 
        	data={tableData}
        	topics={topics}
        	providerTypes={providerTypes}
      />
    ) 

}
