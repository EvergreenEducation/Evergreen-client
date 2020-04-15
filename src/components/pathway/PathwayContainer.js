import React, { useEffect, useState } from 'react';
import { imported } from 'react-imported-component/macro';
import { useHistory } from 'react-router-dom';
import { Card } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import PathwaysTable from 'components/pathway/PathwaysTable';
import { useProviderDataFieldStore } from 'components/provider';
import PathwayStore from 'store/Pathway';
import axiosInstance from 'services/AxiosInstance';
import OfferStore from 'store/Offer';
import ProviderStore from 'store/Provider';

const PathwayUpdateModal = imported(() => import('components/pathway/PathwayUpdateModal'));

configure({
  axios: axiosInstance
})

export default function PathwayContainer({ handleTableData, scopedToProvider = false }) {
  const history = useHistory();
  const [ modalVisibility, setModalVisibility ] = useState(false);
  const [ selectedPathway, setSelectedPathway ] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;
  const pathwayStore = PathwayStore.useContainer();
  const offerStore = OfferStore.useContainer();
  const providerStore = ProviderStore.useContainer();

  const [{
    data: getPathways,
    error: getPathwaysError,
  }] = useAxios('/pathways?scope=with_details');

  const [{
    error: getTopicsError,
  }] = useAxios('/datafields?type=topic');

  const [{
    data: getOffers,
    error: getOffersError,
  }] = useAxios('/offers');

  const [{
    data: getProviders
  }] = useAxios('/providers');

  const openAndPopulateUpdateModal = (pathway) => {
    setSelectedPathway(pathway);
    setModalVisibility(true);
  }

  if (getPathwaysError || getOffersError || getTopicsError) {
    history.push('/error/500');
  }

  useEffect(() => {
    if (getPathways) {
      pathwayStore.addMany(getPathways);
    }
    if (getOffers) {
      offerStore.addMany(getOffers);
    }
    if (getProviders) {
      providerStore.addMany(getProviders);
    }
  }, [getPathways, getOffers, getProviders]);

  const showData = handleTableData(Object.values(pathwayStore.entities));

  return (
    <Card className="shadow-md rounded-md">
      <PathwaysTable
        datafields={datafield.entities}
        providers={provider.entities}
        data={showData}
        handleUpdateModal={openAndPopulateUpdateModal}
        offers={offerStore.entities}
      />
      <PathwayUpdateModal
        pathway={selectedPathway}
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        pathwayStore={pathwayStore}
        scopedToProvider={scopedToProvider}
        providers={Object.values(provider.entities)}
      />
    </Card>
  );
}
