import React, { useEffect, useState } from 'react';
import { imported } from 'react-imported-component/macro';
import { useHistory } from 'react-router-dom';
import { Card, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import PathwaysTable from 'components/pathway/PathwaysTable';
import { useProviderDataFieldStore } from 'components/provider';
import PathwayStore from 'store/Pathway';
import axiosInstance from 'services/AxiosInstance';
import OfferStore from 'store/Offer';

const PathwayUpdateModal = imported(() => import('components/pathway/PathwayUpdateModal'));

configure({
  axios: axiosInstance
})

export default function PathwayContainer({ handleTableData }) {
  const history = useHistory();
  const [ modalVisibility, setModalVisibility ] = useState(false);
  const [ selectedPathway, setSelectedPathway ] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;
  const pathwayStore = PathwayStore.useContainer();
  const offerStore = OfferStore.useContainer();

  const [{
    data: getPathways,
    error: getPathwaysError,
  }] = useAxios('/pathways?scope=with_datafields');

  const [{
    error: getTopicsError,
  }] = useAxios('/datafields?type=topic');

  const [{
    data: getOffers,
    error: getOffersError,
  }] = useAxios('/offers');

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
  }, [getPathways, getOffers]);

  const showData = handleTableData(Object.values(pathwayStore.entities));

  return (
    <Card className="shadow-md rounded-md">
      <PathwaysTable
        datafields={datafield.entities}
        providers={provider.entities}
        data={showData}
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
