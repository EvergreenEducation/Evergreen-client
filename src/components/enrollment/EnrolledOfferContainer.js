import React, {useState, useEffect} from 'react';
import {Card, Button, Row} from 'antd';
import { useLocation } from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import useAxios, {configure} from 'axios-hooks';
import {useProviderDataFieldStore} from 'components/provider';
import OfferStore from 'store/Offer';
import axiosInstance from 'services/AxiosInstance';

import EnrollmentStore from 'store/Enrollment';
import { EnrollmentTable } from 'components/enrollment';

configure({
  axios: axiosInstance,
});

export default function EnrolledOfferContainer({
  handleTableData,
  scopedToProvider = false,
  provider_id,
}) {
  const history = useHistory();
  const location = useLocation();
  const [selectedOffer, setSelectedOffer] = useState({});
  const [
    activateCreditAssignment,
    setActivateCreditAssignment,
  ] = useState(false);
  const store = useProviderDataFieldStore();
  const {datafield, provider} = store;
  const offerStore = OfferStore.useContainer();
  const {entities = []} = offerStore;

  const query = new URLSearchParams(location.search);

  console.log(query.get('selectedOffer'));

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
    <EnrollmentStore.Provider>
      <Card className="shadow-md rounded-md">
        <Row className="mb-2">
          <Button
            className="rounded"
            type="default"
            onClick={() =>
              setActivateCreditAssignment(!activateCreditAssignment)
            }
          >
            {activateCreditAssignment ? 'Lock Credit' : 'Assign Credit'}
          </Button>
        </Row>
        <EnrollmentTable
          selectedOffer={selectedOffer}
          activateCreditAssignment={activateCreditAssignment}
        />
      </Card>
    </EnrollmentStore.Provider>
  );
}
