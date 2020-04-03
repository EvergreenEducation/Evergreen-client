import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from 'services/AxiosInstance';
import useAxios, { configure } from 'axios-hooks';
import { Card } from 'antd';
import { imported } from 'react-imported-component/macro';
import OffersTable from 'components/offer/OffersTable';
import { useProviderDataFieldStore } from 'components/provider';
import OfferStore from 'store/Offer';

configure({
  axios: axiosInstance
})

export default function OfferContainer() {
  const history = useHistory();
  const [ modalVisibility, setModalVisibility ] = useState(false);
  const [ selectedProvider, setSelectedProvider ] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;
  const offer = OfferStore.useContainer();
  const { entities = [] } = offer;

  const [{
    data = [],
    loading,
    error: providerError,
  }] = useAxios('/providers?scope=with_datafields');

  const [{
    data: datafieldsData,
    loading: loadingDataFields,
    error: datafieldError,
  }] = useAxios('/datafields');

  const [{
    data: offersData,
    loading: loadingOffers,
    error: offerError,
  }] = useAxios('/offers');

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
    if (offersData) {
      offer.addMany(offersData);
    }
  }, [data, datafieldsData, offersData]);

  return (
    <Card className="shadow-md rounded-md">
        <OffersTable
            data={Object.values(entities)}
        />
    </Card>
  ); 
}
