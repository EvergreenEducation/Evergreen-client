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

    return (
        <ProviderUpdateModal
            datafields={Object.values(datafieldStore.entities)}
            provider={providerStore.entities[provider_id]}
            visible={visible}
            onCancel={onCancel}
        />
    );
};
