import React, { useEffect } from "react";
import TypeStore from 'store/Type';
import axiosInstance from 'services/AxiosInstance';
import DataFieldTable from 'components/DataFieldTable';

import useAxios, { configure } from 'axios-hooks'
import { Card } from "antd";

configure({
  axios: axiosInstance
})

export default function ProviderTypeContainer() {
    const store = TypeStore.useContainer();
    const { entities, typeEqualsProvider } = store;
    
    const tableData = Object.values(entities).filter(typeEqualsProvider);

    const [{ data = [], loading } ] = useAxios(
      '/datafields?type=provider'
    );

    useEffect(() => {
        store.addMany(data);
    }, [data]);

    return (
        <Card
            title={"Provider Type List"}
            className="shadow-md rounded-md mb-4"
        >
            <DataFieldTable
                data={tableData}
                loading={loading}
                store={store}
                type="provider"
                columns={[
                  {
                      title: 'Cod',
                      dataIndex: 'id',
                      key: 'id',
                  },
                  {
                      title: 'Type Name',
                      dataIndex: 'name',
                      key: 'name',
                  },
                  {
                      title: 'Type Description',
                      dataIndex: 'description',
                      key: 'description',
                  },
                  {
                      title: 'add',
                      dataIndex: 'add',
                      key: 'add',
                  }
              ]}
            />
        </Card>
    );
}
