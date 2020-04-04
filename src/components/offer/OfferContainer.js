import React, { useEffect, useState } from 'react';
import { imported } from 'react-imported-component/macro';
import { useHistory } from 'react-router-dom';
import { Card } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import OffersTable from 'components/offer/OffersTable';
import { useProviderDataFieldStore } from 'components/provider';
import OfferStore from 'store/Offer';
import axiosInstance from 'services/AxiosInstance';
import { groupBy, property } from 'lodash';

const OfferUpdateModal = imported(() => import('components/offer/OfferUpdateModal'));

configure({
  axios: axiosInstance
})

export default function OfferContainer() {
  const history = useHistory();
  const [ modalVisibility, setModalVisibility ] = useState(false);
  const [ selectedOffer, setSelectedOffer ] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;
  const offerStore = OfferStore.useContainer();
  const { entities = [] } = offerStore;

  const [{
    data: getProviderData = [],
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

  const openAndPopulateUpdateModal = (offer) => {
    setSelectedOffer(offer);
    setModalVisibility(true);
  }

  if (providerError || datafieldError || offerError) {
    history.push('/error/500');
  }

  useEffect(() => {
    if (getProviderData) {
      provider.addMany(getProviderData);
    }
    if (datafieldsData) {
      datafield.addMany(datafieldsData);
    }
    if (offersData) {
      offerStore.addMany(offersData);
    }
  }, [getProviderData, datafieldsData, offersData]);

  return (
    <Card className="shadow-md rounded-md">
      <OffersTable
        datafields={datafield.entities}
        providers={provider.entities}
        data={Object.values(entities)}
        handleUpdateModal={openAndPopulateUpdateModal}
      />
      <OfferUpdateModal
        datafields={[]}
        offer={selectedOffer}
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        store={offerStore}
      />
    </Card>
  );
}
