import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import DataFieldTable from 'components/shared/DataFieldTable';

import useAxios, { configure } from 'axios-hooks';
import { Card } from 'antd';

configure({
  axios: axiosInstance,
});

export default function ProviderTypeContainer() {
  const history = useHistory();
  const { datafield } = useGlobalStore();
  const { entities, typeEqualsProvider } = datafield;

  const tableData = Object.values(entities).filter(typeEqualsProvider);

  const [{ data, loading, error }] = useAxios('/datafields?type=provider');

  if (error) {
    history.push('/error/500');
  }

  useEffect(() => {
    if (data) {
      datafield.addMany(data);
    }
  }, [data]);

  return (
    <Card title={'Provider Type List'} className="shadow-md rounded-md mb-4">
      <DataFieldTable
        data={error ? [] : tableData}
        loading={loading}
        store={datafield}
        type="provider"
        rules={[
          {
            required: true,
            message: 'Please enter a provider type name',
          },
        ]}
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
          },
        ]}
      />
    </Card>
  );
}
