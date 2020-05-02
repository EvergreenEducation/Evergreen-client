import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxios, { configure } from 'axios-hooks';
import { groupBy, property } from 'lodash';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { TitleDivider } from 'components/shared';
import { InfoCard, InfoLayout } from 'components/student';
import { Empty } from 'antd';
import 'scss/responsive-carousel-override.scss';

configure({
  axios: axiosInstance,
});

export default function (props) {
  const {
    match: { params },
  } = props;
  const {
    offer: offerStore,
    provider: providerStore,
    datafield,
    pathway: pathwayStore,
  } = useGlobalStore();
  const [{ data: dataFieldPayload }] = useAxios(
    '/datafields?scope=with_offers'
  );
  const [{ data: offerPayload }] = useAxios('/offers?scope=with_details');
  const [{ data: providerPayload }] = useAxios('/providers?scope=with_details');
  const [{ data: pathwayPayload }] = useAxios('/pathways?scope=with_details');

  useEffect(() => {
    if (dataFieldPayload) {
      datafield.addMany(dataFieldPayload);
    }
    if (offerPayload) {
      offerStore.addMany(offerPayload);
    }
    if (providerPayload) {
      providerStore.addMany(providerPayload);
    }
    if (pathwayPayload) {
      pathwayStore.addMany(pathwayPayload);
    }
  }, [dataFieldPayload, offerPayload, providerPayload, pathwayPayload]);

  const providerId = Number(params.id);
  const groupedDataFields = groupBy(datafield.entities, property('type'));

  const provider = providerStore.entities[providerId];

  let Offers = [];
  if (provider && provider.Offers) {
    Offers = provider.Offers;
  }

  let Pathways = [];
  if (provider && provider.Pathways) {
    Pathways = provider.Pathways;
  }

  return (
    <div className="flex flex-col items-center">
      <InfoLayout
        title={provider && provider.name ? provider.name : '---'}
        data={provider}
        groupedDataFields={groupedDataFields}
        type="provider"
      >
        <TitleDivider
          title={'OFFERS'}
          align="center"
          classNames={{ middleSpan: 'text-base' }}
        />
        <section style={{ maxWidth: 896 }}>
          {(Offers.length &&
            Offers.map((o, index) => {
              let p = null;
              if (o && o.provider_id) {
                p = providerStore.entities[o.provider_id];
              }
              return (
                <InfoCard
                  className="mb-4"
                  key={index}
                  data={o}
                  provider={p}
                  groupedDataFields={groupedDataFields}
                  actions={[
                    <Link to={o && o.id ? `/offer/${o.id}` : null}>View</Link>,
                  ]}
                />
              );
            })) || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </section>
        <TitleDivider
          title={'PATHWAYS'}
          align="center"
          classNames={{ middleSpan: 'text-base' }}
        />
        <section style={{ maxWidth: 896 }}>
          {(Pathways.length &&
            Pathways.map((pathway, index) => {
              let p = null;
              if (pathway && pathway.provider_id) {
                p = providerStore.entities[pathway.provider_id];
              }
              return (
                <InfoCard
                  className="mb-4"
                  key={index}
                  data={pathway}
                  provider={p}
                  groupedDataFields={groupedDataFields}
                  actions={[
                    <Link
                      to={
                        pathway && pathway.id ? `/pathway/${pathway.id}` : null
                      }
                    >
                      View
                    </Link>,
                  ]}
                />
              );
            })) || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </section>
      </InfoLayout>
    </div>
  );
}
