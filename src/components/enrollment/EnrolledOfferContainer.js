import React, {useState, useEffect} from 'react';
import {Card, Button, Row} from 'antd';

import {useHistory} from 'react-router-dom';
import useAxios, {configure} from 'axios-hooks';
import {useProviderDataFieldStore} from 'components/provider';
import OfferStore from 'store/Offer';
import axiosInstance from 'services/AxiosInstance';

import EnrollmentStore from 'store/Enrollment';
import {
  BatchEnrollmentModal,
  EnrollmentTable,
  EnrolledOfferTable,
} from 'components/enrollment';

configure({
  axios: axiosInstance,
});

export default function EnrolledOfferContainer({
  handleTableData,
  scopedToProvider = false,
  provider_id,
}) {
  const history = useHistory();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});
  const [viewEnrollments, setViewEnrollments] = useState(false);
  const [activateCreditAssignment, setActivateCreditAssignment] = useState(
    false
  );
  const store = useProviderDataFieldStore();
  const {datafield, provider} = store;
  const offerStore = OfferStore.useContainer();
  const {entities = []} = offerStore;

  const [{data: getProviderData = [], error: providerError}] = useAxios(
    '/providers?scope=with_datafields'
  );

  const [{data: datafieldsData, error: datafieldError}] = useAxios(
    '/datafields'
  );

  let getOffersUrl = provider_id
    ? `/offers?scope=with_details&provider_id=${provider_id}`
    : '/offers?scope=with_details';
  const [{data: offersData, error: offerError}] = useAxios(getOffersUrl);

  const openEnrollModal = offer => {
    setSelectedOffer(offer);
    setModalVisibility(true);
  };

  if (providerError || datafieldError || offerError) {
    history.push('/error/500');
  }

  let showData = handleTableData(Object.values(entities));
  
  if (scopedToProvider) {
    showData = showData.filter(p => {
      return p.provider_id === provider_id;
    });
  }

  const openEnrollments = offer => {
    setSelectedOffer(offer);
    setViewEnrollments(true);
  };

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
    <EnrollmentStore.Provider>
      <Card className="shadow-md rounded-md">
        {!viewEnrollments ? (
          <EnrolledOfferTable
            datafields={datafield.entities}
            providers={provider.entities}
            data={showData}
            openEnrollModal={openEnrollModal}
            openEnrollments={openEnrollments}
          />
        ) : (
          <div>
            <header>
              <Row>
                <Button
                  className="rounded"
                  type="primary"
                  onClick={() => setViewEnrollments(false)}
                >
                  Back
                </Button>
                <Button
                  className="rounded ml-3"
                  type="default"
                  onClick={() =>
                    setActivateCreditAssignment(!activateCreditAssignment)
                  }
                >
                  {activateCreditAssignment ? 'Lock Credit' : 'Assign Credit'}
                </Button>
              </Row>
              <div className="mt-2">
                <Row>Offer name: {selectedOffer.name}</Row>
                <Row>
                  Provider: {provider.entities[selectedOffer.ProviderId].name}
                </Row>
              </div>
            </header>
            <EnrollmentTable
              selectedOffer={selectedOffer}
              activateCreditAssignment={activateCreditAssignment}
            />
          </div>
        )}
        <BatchEnrollmentModal
          offer={selectedOffer}
          visible={modalVisibility}
          onCancel={() => setModalVisibility(false)}
        />
      </Card>
    </EnrollmentStore.Provider>
  );
}
