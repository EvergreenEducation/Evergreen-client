import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';

import { useHistory } from 'react-router-dom';
import useAxios, { configure } from 'axios-hooks';
import { useProviderDataFieldStore } from 'components/provider';
import OfferStore from 'store/Offer';
import AuthService from 'services/AuthService';
import { filter } from 'lodash';
import axiosInstance from 'services/AxiosInstance';

import EnrollmentStore from 'store/Enrollment';
import {
  EnrollModal, EnrollmentTable, EnrolledOfferTable
} from 'components/enrollment';

configure({
  axios: axiosInstance
})

export default function EnrolledOfferContainer({
  handleTableData,
  scopedToProvider = false,
}) {
    const { Provider } = AuthService.currentSession;
    const history = useHistory();
    const [ modalVisibility, setModalVisibility ] = useState(false);
    const [ selectedOffer, setSelectedOffer ] = useState({});
    const [ viewEnrollments, setViewEnrollments ] = useState(false);
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
  
    const [{
      data: offersData,
      error: offerError,
    }] = useAxios(`/offers?scope=with_details`);
  
    const openEnrollModal = (offer) => {
      setSelectedOffer(offer);
      setModalVisibility(true);
    }
  
    if (providerError || datafieldError || offerError) {
      history.push('/error/500');
    }
  
    let showData = handleTableData(Object.values(entities));
  
    if (scopedToProvider) {
      showData = filter(showData, (o) => {
        return o.provider_id === Provider.id;
      })
    }

    const openEnrollments = (offer) => {
      setSelectedOffer(offer);
      setViewEnrollments(true);
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
          {
            !viewEnrollments
              ? (
                <EnrolledOfferTable
                  datafields={datafield.entities}
                  providers={provider.entities}
                  data={showData}
                  openEnrollModal={openEnrollModal}
                  openEnrollments={openEnrollments}
                />
              )
              : (
                <div>
                  <header>
                    <Button
                      type="primary"
                      onClick={() => setViewEnrollments(false)}
                    >
                      Back
                    </Button>
                  </header>
                  <EnrollmentTable
                    selectedOffer={selectedOffer}
                  />
                </div>
              )
          }
          <EnrollModal
            offer={selectedOffer}
            visible={modalVisibility}
            onCancel={() => setModalVisibility(false)}
          />
      </Card>
    </EnrollmentStore.Provider>
  );
};
