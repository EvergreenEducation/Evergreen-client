import React, { useEffect } from "react";
import TypeStore from 'store/Type';
import axiosInstance from 'services/AxiosInstance';
import DataFieldTable from 'components/DataFieldTable';

import useAxios, { configure } from 'axios-hooks'
import { Card } from 'antd';

configure({
  axios: axiosInstance
})

export default function TopicContainer() {
    const store = TypeStore.useContainer();
    const { entities, typeEqualsTopic } = store;
    
    const tableData = Object.values(entities).filter(typeEqualsTopic);

    const [{ data = [], loading } ] = useAxios(
      '/datafields?type=topic'
    );

    useEffect(() => {
      store.addMany(data);
    }, [data]);

    return (
        <Card
            title="Topics"
            className="shadow-md rounded-md"
        >
            <DataFieldTable
                data={tableData}
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
