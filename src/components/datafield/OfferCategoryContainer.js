import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DataFieldStore from 'store/DataField';
import axiosInstance from 'services/AxiosInstance';
import DataFieldTable from 'components/shared/DataFieldTable';

import useAxios, { configure } from 'axios-hooks'
import { Card } from 'antd';

configure({
  axios: axiosInstance
})

export default function OfferCategoryContainer(props) {
    const history = useHistory();
    const store = DataFieldStore.useContainer();
    const { entities, typeEqualsOfferCategory } = store;
    
    const tableData = Object.values(entities).filter(typeEqualsOfferCategory);

    const [{ data, loading, error } ] = useAxios(
      '/datafields?type=offer_category'
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
            title="Offer Categories"
            className="shadow-md rounded-md mb-4"
        >
            <DataFieldTable
                data={error ? [] : tableData}
                store={store}
                type="offer_category"
                loading={loading}
                columns={[
                    {
                        title: 'Cod',
                        dataIndex: 'id',
                        key: 'id'
                    },
                    {
                        title: 'Category Name',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: 'Description',
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
