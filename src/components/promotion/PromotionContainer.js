import React, { useState, useEffect } from 'react';
import { imported } from 'react-imported-component/macro';
import { Layout, Tooltip, Button, Card, Empty } from 'antd';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import matchSorter from 'match-sorter';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import { LogOutTopbar, SearchHeader } from 'components/shared';
import useGlobalStore from 'store/GlobalStore';
import PromoCard from 'components/promotion/PromoteCard/PromoCard';

configure({
  axios: axiosInstance,
});

const { Content } = Layout;

export default function () {
  const [searchString, setSearchString] = useState('');
  const [showPromoted, setShowPromoted] = useState(true);
  const {
    provider: providerStore,
    pathway: pathwayStore,
    offer: offerStore,
  } = useGlobalStore();

  const [{ data: getPathways }] = useAxios('/pathways?scope=with_files');

  const [{ data: getOffers }] = useAxios('/offers?scope=with_files');

  const [{ data: getProviders }] = useAxios('/providers?scope=with_files');

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
    if (showPromoted) {
      setShowPromoted(false);
    }
    if (event.target.value.length === 0) {
      setShowPromoted(true);
    }
    setSearchString(event.target.value);
  };

  const handleDataAfterSearch = (data, keys = ['name']) => {
    return matchSorter(data, searchString, { keys });
  };

  let showData = handleDataAfterSearch(data);

  if (showPromoted) {
    showData = handleDataAfterSearch(data).filter((d) => {
      return d.is_main_promo === true || d.is_local_promo === true;
    });
  }

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
    <Layout className="bg-transparent h-auto">
      <LogOutTopbar>
        <SearchHeader
          title="PROMOTIONS"
          onSearch={handleDataSearch}
          onChange={handleOnChange}
        ></SearchHeader>
      </LogOutTopbar>
      <Content className="p-6">
        <main className="shadow-md rounded-md w-full bg-white h-full pt-4 px-5 flex flex-wrap">
          {(showData.length &&
            showData.map((d, index) => {
              return <PromoCard key={index} data={d} />;
            })) || <Empty className="m-auto" />}
        </main>
      </Content>
    </Layout>
  );
}
