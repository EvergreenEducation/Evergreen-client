import React, { useEffect, useState } from 'react';
import { imported } from 'react-imported-component/macro';
import { useHistory } from 'react-router-dom';
import { Card, Layout, Tooltip, Button, Col } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import PathwaysTable from 'components/pathway/PathwaysTable';
import { useProviderDataFieldStore } from 'components/provider';
import PathwayStore from 'store/Pathway';
import axiosInstance from 'services/AxiosInstance';
import OfferStore from 'store/Offer';
import ProviderStore from 'store/Provider';
import matchSorter from 'match-sorter';
import { LogOutTopbar, SearchHeader } from 'components/shared';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const ProviderUpdateContainer = imported(() =>
  import('components/provider/ProviderUpdateContainer')
);

const FormModal = imported(() => import('components/shared/FormModal'));

const PathwayCreationContainer = imported(() =>
  import('components/pathway/PathwayCreationContainer')
);

const PathwayUpdateModal = imported(() =>
  import('components/pathway/PathwayUpdateModal')
);

configure({
  axios: axiosInstance,
});

const { Content } = Layout;

export default function PathwayContainer({
  role,
  providerId,
  openProviderUpdateModal,
}) {
  const [searchString, setSearchString] = useState('');
  const history = useHistory();
  const [modalStates, setModalStates] = useState({
    pathwayCreation: false,
    pathwayUpdate: false,
  });
  const [selectedPathway, setSelectedPathway] = useState({});
  const store = useProviderDataFieldStore();
  const { datafield, provider } = store;
  const pathwayStore = PathwayStore.useContainer();
  const offerStore = OfferStore.useContainer();
  const providerStore = ProviderStore.useContainer();

  let getPathwaysUrl =
    role === 'provider'
      ? `/pathways?scope=with_details&provider_id=${providerId}`
      : '/pathways?scope=with_details';

  const [{ data: getPathways, error: getPathwaysError }] = useAxios(
    getPathwaysUrl
  );

  const [{ data: getDataFields, error: getDataFieldsError }] = useAxios(
    '/datafields'
  );

  const [{ data: getOffers, error: getOffersError }] = useAxios('/offers');

  let getProviderUrl =
    role === 'provider' ? `/providers/${providerId}` : '/providers';

  const [{ data: getProviders }] = useAxios(getProviderUrl);

  const openAndPopulateUpdateModal = (pathway) => {
    setSelectedPathway(pathway);
    setModalStates({ ...modalStates, pathwayUpdate: true });
  };

  if (getPathwaysError || getOffersError || getDataFieldsError) {
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
      if (role === 'provider') {
        providerStore.addOne(getProviders);
      } else {
        providerStore.addMany(getProviders);
      }
    }
    if (getDataFields) {
      datafield.addMany(getDataFields);
    }
  }, [getPathways, getOffers, getProviders, getDataFields]);

  const handleDataAfterSearch = (data, keys = ['name']) => {
    const results = matchSorter(data, searchString, { keys });
    return results;
  };

  const handleDataSearch = (searchVal) => {
    return setSearchString(searchVal);
  };

  let showData = handleDataAfterSearch(Object.values(pathwayStore.entities));

  if (role === 'provider') {
    showData = showData.filter((p) => {
      return p.provider_id === providerId;
    });
  }

  return (
    <Layout className="bg-transparent">
      <LogOutTopbar
        renderNextToLogOut={
          role === 'provider' && (
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
          )
        }
      >
        <Col span={14}>
          <SearchHeader title="PATHWAYS" onSearch={handleDataSearch}>
            <Button
              className="rounded text-xs flex items-center ml-2"
              type="primary"
              size="small"
              onMouseEnter={() => {
                FormModal.preload();
                PathwayCreationContainer.preload();
              }}
              onClick={() =>
                setModalStates({ ...modalStates, pathwayCreation: true })
              }
            >
              <FontAwesomeIcon
                className="text-white mr-1 text-xs"
                icon={faPlusCircle}
              />
              PATHWAY
            </Button>
          </SearchHeader>
        </Col>
      </LogOutTopbar>
      <Content className="p-6">
        <Card className="shadow-md rounded-md">
          <PathwaysTable
            datafields={datafield.entities}
            providers={provider.entities}
            data={showData}
            handleUpdateModal={openAndPopulateUpdateModal}
            offers={offerStore.entities}
            scopedToProvider={role === 'provider'}
          />
          <FormModal
            title="New Pathway"
            visible={modalStates.pathwayCreation}
            FormComponent={PathwayCreationContainer}
            role={role}
            providerId={providerId}
            onCancel={() =>
              setModalStates({ ...modalStates, pathwayCreation: false })
            }
          />
          <PathwayUpdateModal
            pathway={selectedPathway}
            visible={modalStates.pathwayUpdate}
            onCancel={() =>
              setModalStates({ ...modalStates, pathwayUpdate: false })
            }
            pathwayStore={pathwayStore}
            scopedToProvider={role === 'provider'}
            role={role}
            providers={Object.values(provider.entities)}
          />
        </Card>
      </Content>
    </Layout>
  );
}
