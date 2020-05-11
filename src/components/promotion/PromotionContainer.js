import React, { useState, useEffect } from 'react';
import { imported } from 'react-imported-component/macro';
import { Layout, Tooltip, Button, Card, Empty } from 'antd';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import matchSorter from 'match-sorter';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import { LogOutTopbar, SearchHeader } from 'components/shared';
import useGlobalStore from 'store/GlobalStore';

configure({
  axios: axiosInstance,
});

const { Content } = Layout;

export default function () {
  const [searchString, setSearchString] = useState('');
  const {
    provider: providerStore,
    pathway: pathwayStore,
    offer: offerStore,
  } = useGlobalStore();

  const [{ data: getPathways }] = useAxios('/pathways');

  const [{ data: getOffers }] = useAxios('/offers');

  const [{ data: getProviders }] = useAxios('/providers');

  const offers = Object.values(offerStore.entities).map((o) => {
    return {
      ...o,
      entity_type: 'offer',
    };
  });

  const providers = Object.values(providerStore.entities).map((p) => {
    return {
      ...p,
      entity_type: 'provider',
    };
  });

  const pathways = Object.values(pathwayStore.entities).map((p) => {
    return {
      ...p,
      entity_type: 'pathway',
    };
  });

  const data = [...offers, ...pathways, ...providers];

  const handleDataSearch = (searchVal) => {
    return setSearchString(searchVal);
  };

  const handleOnChange = (event) => {
    setSearchString(event.target.value);
  };

  const handleDataAfterSearch = (data, keys = ['name']) => {
    return matchSorter(data, searchString, { keys });
  };

  const showData = handleDataAfterSearch(data);

  useEffect(() => {
    if (getPathways) {
      pathwayStore.addMany(getPathways);
    }
    if (getOffers) {
      offerStore.addMany(getOffers);
    }
    if (getProviders) {
      providerStore.addMany(getProviders);
    }
  }, [getPathways, getOffers, getProviders]);

  return (
    <Layout className="bg-transparent h-full">
      <LogOutTopbar>
        <SearchHeader
          title="PROMOTIONS"
          onSearch={handleDataSearch}
          onChange={handleOnChange}
        ></SearchHeader>
      </LogOutTopbar>
      <Content className="p-6">
        <main className="shadow-md rounded-md w-full bg-white h-full pt-4 px-5 flex flex-wrap justify-between">
          {(showData.length &&
            showData.map((d, index) => {
              return (
                <Card
                  key={index}
                  className="border rounded border-solid mt-2"
                  style={{ width: 200, height: 70 }}
                >
                  {d.name}
                </Card>
              );
            })) || <Empty className="m-auto" />}
        </main>
      </Content>
    </Layout>
  );
}
