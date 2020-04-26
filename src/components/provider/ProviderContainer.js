import React, { useEffect, useState } from 'react';
import axiosInstance from 'services/AxiosInstance';
import useAxios, { configure } from 'axios-hooks';
import { Card, Layout, Col } from 'antd';
import { imported } from 'react-imported-component/macro';
import { ProvidersTable } from 'components/provider';
import useGlobalStore from 'store/GlobalStore';
import {
  SearchHeader,
  LogOutTopbar,
  FaPlusCircleButton,
} from 'components/shared';
import matchSorter from 'match-sorter';

const ProviderUpdateModal = imported(() =>
  import('components/provider/ProviderUpdateModal')
);

const FormModal = imported(() => import('components/shared/FormModal'));
const ProviderCreationContainer = imported(() =>
  import('components/provider/ProviderCreationContainer')
);

configure({
  axios: axiosInstance,
});

const { Content } = Layout;

export default function ProviderContainer(props) {
  const { history } = props;
  const [searchString, setSearchString] = useState('');
  const [modalStates, setModalStates] = useState({
    providerCreation: false,
    providerUpdate: false,
  });
  const [selectedProvider, setSelectedProvider] = useState({});
  const { datafield, provider } = useGlobalStore();

  const [{ data = [], loading, error: providerError }] = useAxios(
    '/providers?scope=with_details'
  );

  const [
    { data: datafieldsData, loading: loadingDataFields, error: datafieldError },
  ] = useAxios('/datafields?type=provider&type=topic');

  const openAndPopulateUpdateModal = (provider) => {
    setSelectedProvider(provider);
    setModalStates({ ...modalStates, providerUpdate: true });
  };

  if (providerError || datafieldError) {
    history.push('/error/500');
  }

  useEffect(() => {
    if (data) {
      provider.addMany(data);
    }
    if (datafieldsData) {
      datafield.addMany(datafieldsData);
    }
  }, [data, datafieldsData]);

  const entities = Object.values(provider.entities);
  const dataFieldEntities = Object.values(datafield.entities);

  const handleDataAfterSearch = (data, keys = ['name']) => {
    return matchSorter(data, searchString, { keys });
  };

  const handleDataSearch = (searchVal) => {
    return setSearchString(searchVal);
  };

  const showData = handleDataAfterSearch(entities);

  return (
    <Layout className="bg-transparent">
      <LogOutTopbar>
        <Col span={14}>
          <SearchHeader title="PROVIDERS" onSearch={handleDataSearch}>
            <FaPlusCircleButton
              onMouseEnter={() => {
                FormModal.preload();
                ProviderCreationContainer.preload();
              }}
              onClick={() =>
                setModalStates({ ...modalStates, providerCreation: true })
              }
              text="PROVIDER"
            />
          </SearchHeader>
        </Col>
      </LogOutTopbar>
      <Content className="p-6">
        <Card className="shadow-md rounded-md">
          <ProvidersTable
            data={providerError ? [] : showData}
            loading={loading && loadingDataFields}
            datafields={datafieldError ? [] : dataFieldEntities}
            handleUpdateModal={openAndPopulateUpdateModal}
          />
          <ProviderUpdateModal
            datafields={datafieldError ? [] : dataFieldEntities}
            provider={selectedProvider}
            visible={modalStates.providerUpdate}
            onCancel={() =>
              setModalStates({ ...modalStates, providerUpdate: false })
            }
          />
          <FormModal
            title="New Provider"
            visible={modalStates.providerCreation}
            FormComponent={ProviderCreationContainer}
            onCancel={() =>
              setModalStates({ ...modalStates, providerCreation: false })
            }
          />
        </Card>
      </Content>
    </Layout>
  );
}
