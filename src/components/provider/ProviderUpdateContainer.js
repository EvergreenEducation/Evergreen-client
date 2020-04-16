import React, { useEffect } from 'react';
import ProviderUpdateModal from 'components/provider/ProviderUpdateModal';
import DataFieldStore from 'store/DataField';
import ProviderStore from 'store/Provider';
import AuthService from 'services/AuthService';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';

configure({
    axios: axiosInstance,
})

export default function ProviderUpdateContainer({ provider = {}, visible, onCancel }) {
    const datafieldStore = DataFieldStore.useContainer();
    const providerStore = ProviderStore.useContainer();
    const { Provider } = AuthService.currentSession;

    const [{ data }] = useAxios(`/providers${'/' + Provider.id}?scope=with_details`);
    
    useEffect(() => {
        if (data) {
            providerStore.updateOne(data);
        }
    }, [data, provider, providerStore.entities[Provider.id]]);

    return (
        <ProviderUpdateModal
            datafields={Object.values(datafieldStore.entities)}
            provider={providerStore.entities[Provider.id]}
            visible={visible}
            onCancel={onCancel}
        />
    );
};
