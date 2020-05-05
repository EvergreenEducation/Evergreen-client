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

export default function TopicContainer(props) {
  const history = useHistory();
  const { datafield } = useGlobalStore();
  const { entities, typeEqualsTopic } = datafield;

  const tableData = Object.values(entities).filter(typeEqualsTopic);

  const [{ data, loading, error }] = useAxios('/datafields?type=topic');

  if (error) {
    history.push('/error/500');
  }

  useEffect(() => {
    if (data) {
      datafield.addMany(data);
    }
  }, [data]);

  return (
    <Card title="Topics" className="shadow-md rounded-md">
      <DataFieldTable
        data={error ? [] : tableData}
        store={datafield}
        type="topic"
        loading={loading}
        rules={[
          {
            required: true,
            message: 'Please enter a topic name',
          },
          {
            required: true,
            message: '"Others" is already reserved. It cannot be used.',
            pattern: new RegExp(/^(?!(Others)$).+$/gm),
          },
        ]}
        columns={[
          {
            title: 'Cod',
            dataIndex: 'id',
            key: 'id',
            className: 'antd-col',
          },
          {
            title: 'Topic Name',
            dataIndex: 'name',
            key: 'name',
            className: 'antd-col',
          },
          {
            title: 'Topic Description',
            dataIndex: 'description',
            key: 'description',
            className: 'antd-col',
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
