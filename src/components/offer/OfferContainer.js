import React, { useEffect, useState } from 'react';
import {} from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { useHistory } from 'react-router-dom';
import { Card, Drawer, Button, message } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import OfferTable from 'components/offer/OfferTable';
import { useProviderDataFieldStore } from 'components/provider';
import OfferStore from 'store/Offer';
import axiosInstance from 'services/AxiosInstance';

const OfferUpdateModal = imported(() => import('components/offer/OfferUpdateModal'));
const BatchEnrollmentModal = imported(() => import('components/enrollment/BatchEnrollmentModal'));

configure({
  axios: axiosInstance
})

export default function OfferContainer({
  handleTableData,
  scopedToProvider = false,
  provider_id,
  basePath
}) {
  const history = useHistory();
  const [ openable, setOpenable ] = useState({
    drawer: false,
    updateModal: false,
    batchEnrollModal: false,
  });
  const [ selectedOffer, setSelectedOffer ] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;
  const offerStore = OfferStore.useContainer();
  const { entities = [] } = offerStore;

  const [{
    data: getProviderData = [],
    error: providerError,
  }] = useAxios('/providers?scope=with_datafields');

  const [{
    data: datafieldsData,
    error: datafieldError,
  }] = useAxios('/datafields');

  let getOffersUrl = provider_id ? `/offers?scope=with_details&provider_id=${provider_id}`: '/offers?scope=with_details';

  const [{
    data: offersData,
    error: offerError,
  }] = useAxios(getOffersUrl);

  const openAndPopulateUpdateModal = (offer) => {
    setSelectedOffer(offer);
    setOpenable({
      ...openable,
      updateModal: true,
    });
  }

  const handleRowSelection = (record, rowIndex) => {
    if (record) {
      setSelectedOffer(record);
      setOpenable({
        ...openable,
        drawer: true,
      });
      return;
    }
    message.error('Could not receive offer\'s information.');
  }

  const openBatchEnrollmentModal = () => {
    setOpenable({
      ...openable,
      batchEnrollModal: true,
      drawer: true,
    });
  }

  const viewEnrollments = (offer) => {
    if (offer) {
      history.push(`${basePath}/enrollments?offer=${offer.id}`);
      return;
    }
    message.error('Could not receive offer\'s information.');
  }

  if (providerError || datafieldError || offerError) {
    history.push('/error/500');
  }

  let showData = handleTableData(Object.values(entities));
  
  if (scopedToProvider) {
    showData = showData.filter(p => {
      return p.provider_id === provider_id;
    });
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
      <OfferTable
        datafields={datafield.entities}
        providers={provider.entities}
        data={showData}
        handleUpdateModal={openAndPopulateUpdateModal}
        handleRowSelection={handleRowSelection}
        viewEnrollments={viewEnrollments}
      />
      <OfferUpdateModal
        offer={selectedOffer}
        visible={openable.updateModal}
        onCancel={() => setOpenable({ ...openable, updateModal: false })}
        offerStore={offerStore}
        scopedToProvider={scopedToProvider}
      />
      <Drawer
        placement="bottom"
        visible={openable.drawer}
        onClose={() => setOpenable({ ...openable, drawer: false })}
        height="bottom"
      >
        <Button
          className="rounded"
          type="primary"
          onClick={() => openBatchEnrollmentModal()}
        >
          Batch Enroll
        </Button>
        <BatchEnrollmentModal
          offer={selectedOffer}
          visible={openable.batchEnrollModal}
          onCancel={() => setOpenable({
            ...openable,
            batchEnrollModal: false,
          })}
        />
      </Drawer>
    </Card>
  );
}
