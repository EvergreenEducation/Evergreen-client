import React, { useEffect } from 'react';
import ProviderUpdateModal from 'components/provider/ProviderUpdateModal';
import DataFieldStore from 'store/DataField';
import ProviderStore from 'store/Provider';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';


configure({
    axios: axiosInstance,
})

export default function ProviderUpdateContainer({ provider_id, visible, onCancel }) {
    const datafieldStore = DataFieldStore.useContainer();
    const providerStore = ProviderStore.useContainer();

    const [{ data }] = useAxios(`/providers/${provider_id}?scope=with_details`);

    useEffect(() => {
        if (data) {
            providerStore.updateOne(data);
        }
    }, [data, provider_id, providerStore.entities[provider_id]]);

    // useEffect(() => {
    //     providerDetailedData(provider_id)
    // }, [provider_id]);

    // function providerDetailedData(provider_id) {
    //     providerDetailedDataApi(provider_id).then(res => {
    //         if (res.data) {
    //             providerStore.updateOne(res.data);
    //             // providerStore.updateMany(res.data);
    //         }
    //     }).catch(err => {
    //         console.log('errror', err)
    //     })
    // }

    // async function providerDetailedDataApi(provider_id) {
    //     let Data = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/providers/${provider_id}?scope=with_details`)
    //     return Data
    // }

    return (
        <ProviderUpdateModal
            datafields={Object.values(datafieldStore.entities)}
            provider={providerStore.entities[provider_id]}
            visible={visible}
            onCancel={onCancel} />
    );
};
