import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from 'services/AxiosInstance';
import useAxios, { configure } from 'axios-hooks';
import { Card } from 'antd';
import { imported } from 'react-imported-component/macro';
import OffersTable from 'components/offer/OffersTable';
import { useProviderDataFieldStore } from 'components/provider';

configure({
  axios: axiosInstance
})

const mockData = [
    {
        key: '1',
        id: 1,
        name: 'Maths differential equations solving curse [156625906]',
        category: 'Web Development',
        provider: 'Unicore Technology Vision',
        topics: ['Education', 'Computer Science'],
        start_date: '2020-02-18',
    }
];

export default function OfferContainer() {
  const history = useHistory();
  const [ modalVisibility, setModalVisibility ] = useState(false);
  const [ selectedProvider, setSelectedProvider ] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;

  const [{
    data = [],
    loading,
    error: providerError,
  }] = useAxios('/providers?scope=with_datafields');

  const [{
    data: datafieldsData,
    loading: loadingDataFields,
    error: datafieldError,
  }] = useAxios('/datafields?type=provider&type=topic');

//   const openAndPopulateUpdateModal = (provider) => {
//     setSelectedProvider(provider);
//     setModalVisibility(true);
//   }

  if (providerError || datafieldError) {
    history.push('/error/500');
  }

  useEffect(() => {
    if (data) {
      provider.addMany(data);
    }
    if (datafieldsData) {
      datafield.addMany(datafieldsData);
    }
  }, [data, datafieldsData]);

  return (
    <Card className="shadow-md rounded-md">
        <OffersTable
            data={mockData}
        />
    </Card>
  ); 
}
