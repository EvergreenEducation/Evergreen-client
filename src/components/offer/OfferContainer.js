import React, { useEffect, useState } from 'react';
import { imported } from 'react-imported-component/macro';
import { useHistory } from 'react-router-dom';
import { Card, Drawer, Button, message, Layout, Tooltip, Col } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import OfferTable from 'components/offer/OfferTable';
import { useProviderDataFieldStore } from 'components/provider';
import OfferStore from 'store/Offer';
import axiosInstance from 'services/AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { LogOutTopbar, SearchHeader } from 'components/shared';
import matchSorter from 'match-sorter';

const { Content } = Layout;

const FormModal = imported(() => import('components/shared/FormModal'));

const OfferCreationContainer = imported(() =>
  import('components/offer/OfferCreationContainer')
);

const OfferUpdateModal = imported(() =>
  import('components/offer/OfferUpdateModal')
);

const BatchEnrollmentModal = imported(() =>
  import('components/enrollment/BatchEnrollmentModal')
);

const ProviderUpdateContainer = imported(() =>
  import('components/provider/ProviderUpdateContainer')
);

configure({
  axios: axiosInstance,
});

export default function OfferContainer(props) {
  const [searchString, setSearchString] = useState('');
  const { basePath, openProviderUpdateModal, role, providerId } = props;
  const history = useHistory();
  const [openable, setOpenable] = useState({
    drawer: false,
    updateModal: false,
    batchEnrollModal: false,
    formModal: false,
  });
  const [selectedOffer, setSelectedOffer] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;
  const offerStore = OfferStore.useContainer();
  const { entities = [] } = offerStore;

  const [{ data: getProviderData = [], error: providerError }] = useAxios(
    '/providers?scope=with_datafields'
  );

  const [{ data: datafieldsData, error: datafieldError }] = useAxios(
    '/datafields'
  );

  let getOffersUrl = providerId
    ? `/offers?scope=with_details&provider_id=${providerId}`
    : '/offers?scope=with_details';

  const [{ data: offersData, error: offerError }] = useAxios(getOffersUrl);

  const openAndPopulateUpdateModal = (offer) => {
    setSelectedOffer(offer);
    setOpenable({
      ...openable,
      updateModal: true,
    });
  };

  const handleRowSelection = (record, rowIndex) => {
    if (record) {
      setSelectedOffer(record);
      setOpenable({
        ...openable,
        drawer: true,
      });
      return;
    }
    message.error("Could not receive offer's information.");
  };

  const openBatchEnrollmentModal = () => {
    setOpenable({
      ...openable,
      batchEnrollModal: true,
      drawer: true,
    });
  };

  const viewEnrollments = (offer) => {
    if (offer) {
      history.push(`${basePath}/enrollments?offer=${offer.id}`);
      return;
    }
    message.error("Could not receive offer's information.");
  };

  if (providerError || datafieldError || offerError) {
    history.push('/error/500');
  }

  const handleDataAfterSearch = (data, keys = ['name']) => {
    const results = matchSorter(data, searchString, { keys });
    return results;
  };

  const handleDataSearch = (searchVal) => {
    return setSearchString(searchVal);
  };

  let showData = handleDataAfterSearch(Object.values(entities));

  if (role === 'provider') {
    showData = showData.filter((offer) => {
      return offer.provider_id === providerId;
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
    <Layout className="bg-transparent">
      <LogOutTopbar
        renderNextToLogOut={
          <Tooltip title="Update my information">
            <Button
              className="rounded mr-2 px-4"
              type="primary"
              size="small"
              onClick={() => openProviderUpdateModal()}
              onMouseEnter={() => ProviderUpdateContainer.preload()}
            >
              <FontAwesomeIcon
                className="text-white relative"
                style={{ left: 2 }}
                icon={faUserEdit}
              />
            </Button>
          </Tooltip>
        }
      >
        <Col span={14}>
          <SearchHeader
            title="NEW OFFERS / OPPORTUNITIES"
            onSearch={handleDataSearch}
          >
            <Button
              className="rounded text-xs flex items-center ml-2"
              type="primary"
              size="small"
              onMouseEnter={() => {
                FormModal.preload();
                OfferCreationContainer.preload();
              }}
              onClick={() => setOpenable({ ...openable, formModal: true })}
            >
              <FontAwesomeIcon
                className="text-white mr-1 text-xs"
                icon={faPlusCircle}
              />
              OFFER
            </Button>
          </SearchHeader>
        </Col>
      </LogOutTopbar>
      <Content className="p-6">
        <Card className="shadow-md rounded-md">
          <OfferTable
            datafields={datafield.entities}
            providers={provider.entities}
            data={showData}
            handleUpdateModal={openAndPopulateUpdateModal}
            handleRowSelection={handleRowSelection}
            viewEnrollments={viewEnrollments}
          />
          <FormModal
            title="New Offer / Opportunity"
            visible={openable.formModal}
            FormComponent={OfferCreationContainer}
            role={role}
            providerId={providerId}
            onCancel={() => setOpenable({ ...openable, formModal: false })}
          />
          <OfferUpdateModal
            offer={selectedOffer}
            visible={openable.updateModal}
            onCancel={() => setOpenable({ ...openable, updateModal: false })}
            offerStore={offerStore}
            scopedToProvider={false}
            role={role}
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
              onMouseEnter={() => BatchEnrollmentModal.preload()}
            >
              Batch Enroll
            </Button>
            <BatchEnrollmentModal
              offer={selectedOffer}
              visible={openable.batchEnrollModal}
              onCancel={() =>
                setOpenable({
                  ...openable,
                  batchEnrollModal: false,
                })
              }
            />
          </Drawer>
        </Card>
      </Content>
    </Layout>
  );
}
