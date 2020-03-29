import React, { useEffect } from "react";
import ProviderTypeTable from 'components/provider/ProviderTypeTable';
import ProviderTypeStore from 'store/ProviderType';
import axiosInstance from 'services/AxiosInstance';

import useAxios, { configure } from 'axios-hooks'
import { Card } from "antd";

configure({
  axios: axiosInstance
})

export default function ProviderTypeContainer() {
    const store = ProviderTypeStore.useContainer();
    const { entities } = store;
    
    const tableData = Object.values(entities);

    const [{ data = [], loading } ] = useAxios(
      '/provider_types'
    );

    useEffect(() => {
      store.addAll(data);
    }, [data]);

    return (
        <Card
            title={"Provider Type List"}
            className="shadow-md rounded-md"
        >
            <ProviderTypeTable
                data={tableData}
                loading={loading}
            />
        </Card>
    );
}
