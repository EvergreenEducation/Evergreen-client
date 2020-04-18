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
import AuthService from 'services/AuthService';
import ProviderStore from 'store/Provider';

const PathwayUpdateModal = imported(() => import('components/pathway/PathwayUpdateModal'));

configure({
  axios: axiosInstance
})

export default function PathwayContainer({ handleTableData, scopedToProvider = false }) {
  const { provider_id } = AuthService.currentSession;
  const history = useHistory();
  const [ modalVisibility, setModalVisibility ] = useState(false);
  const [ selectedPathway, setSelectedPathway ] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;
  const pathwayStore = PathwayStore.useContainer();
  const offerStore = OfferStore.useContainer();
  const providerStore = ProviderStore.useContainer();

  let getPathwaysUrl = (
    provider_id
      ? `/pathways?scope=with_details&provider_id=${provider_id}`
      : '/pathways?scope=with_details'
  )

  const [{
    data: getPathways,
    error: getPathwaysError,
  }] = useAxios(getPathwaysUrl);

  const [{
    error: getTopicsError,
  }] = useAxios('/datafields?type=topic');

  const [{
    data: getOffers,
    error: getOffersError,
  }] = useAxios('/offers');

  let getProviderUrl = (
    scopedToProvider 
      ? `/providers/${provider_id}`
      : '/providers'
  )

  const [{
    data: getProviders
  }] = useAxios(getProviderUrl);

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
      if (scopedToProvider) {
        providerStore.addOne(getProviders);
      } else {
        providerStore.addMany(getProviders);
      }
    }
  }, [getPathways, getOffers, getProviders]);

  let showData = handleTableData(Object.values(pathwayStore.entities));
  
  if (scopedToProvider) {
    showData = showData.filter(p => {
      return p.provider_id === provider_id;
    });
  }

  return (
    <Card className="shadow-md rounded-md">
      <PathwaysTable
        datafields={datafield.entities}
        providers={provider.entities}
        data={showData}
        handleUpdateModal={openAndPopulateUpdateModal}
        offers={offerStore.entities}
        scopedToProvider={scopedToProvider}
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
