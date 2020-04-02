import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DataFieldStore from 'store/DataField';
import axiosInstance from 'services/AxiosInstance';
import DataFieldTable from 'components/DataFieldTable';

import useAxios, { configure } from 'axios-hooks'
import { Card } from 'antd';

configure({
  axios: axiosInstance
})

export default function TopicContainer(props) {
    const history = useHistory();
    const store = DataFieldStore.useContainer();
    const { entities, typeEqualsTopic } = store;
    
    const tableData = Object.values(entities).filter(typeEqualsTopic);

    const [{ data, loading, error } ] = useAxios(
      '/datafields?type=topic'
    );

    if (error) {
        history.push('/error/500');
    }

    useEffect(() => {
        if (data) {
            store.addMany(data);
        }
    }, [data]);

    return (
        <Card
            title="Topics"
            className="shadow-md rounded-md"
        >
            <DataFieldTable
                data={error ? [] : tableData}
                store={store}
                type="topic"
                loading={loading}
                columns={[
                    {
                        title: 'Cod',
                        dataIndex: 'id',
                        key: 'id'
                    },
                    {
                        title: 'Topic Name',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: 'Topic Description',
                        dataIndex: 'description',
                        key: 'description'
                    },
                    {
                        title: 'add',
                        dataIndex: 'add',
                        key: 'add'
                    }
                ]}
            />
        </Card>
    );
}
