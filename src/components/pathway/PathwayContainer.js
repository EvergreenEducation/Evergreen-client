import React, { useEffect, useState } from 'react';
import { imported } from 'react-imported-component/macro';
import { useHistory } from 'react-router-dom';
import { Card, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import PathwaysTable from 'components/pathway/PathwaysTable';
import { useProviderDataFieldStore } from 'components/provider';
import PathwayStore from 'store/Pathway';
import OfferStore from 'store/Offer';
import axiosInstance from 'services/AxiosInstance';
// import PathwayUpdateModal from 'components/pathway/PathwayUpdateModal';

const PathwayUpdateModal = imported(() => import('components/pathway/PathwayUpdateModal'));

configure({
  axios: axiosInstance
})

export default function PathwayContainer() {
  const history = useHistory();
  const [ modalVisibility, setModalVisibility ] = useState(false);
  const [ selectedPathway, setSelectedPathway ] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;
  const offerStore = OfferStore.useContainer();
  const pathwayStore = PathwayStore.useContainer();
  const { entities = [] } = offerStore;

  const [{
    data: getPathways,
    loading: loadingPathways,
    error: getPathwaysError,
  }] = useAxios('/pathways?scope=with_datafields');

  const [{
    data: getTopics,
    loading: loadingDataFields,
    error: getTopicsError,
  }] = useAxios('/datafields?type=topic');

  const [{
    data: getOffers,
    loading: loadingOffers,
    error: getOffersError,
  }] = useAxios('/offers?scope=with_datafields');

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
    if (getPathwaysError) {
        const { status, statusText } = getPathwaysError.request;
        notification.error({
            message: status,
            description: statusText,
        })
    }
  }, [getPathways]);

  return (
    <Card className="shadow-md rounded-md">
      <PathwaysTable
        datafields={datafield.entities}
        providers={provider.entities}
        data={Object.values(pathwayStore.entities)}
        handleUpdateModal={openAndPopulateUpdateModal}
      />
      <PathwayUpdateModal
        pathway={selectedPathway}
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        pathwayStore={pathwayStore}
      />
    </Card>
  );
}
