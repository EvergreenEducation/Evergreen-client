import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxios, { configure } from 'axios-hooks';
import { groupBy, property } from 'lodash';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { TitleDivider } from 'components/shared';
import { InfoCard, InfoLayout } from 'components/student';
import 'assets/scss/responsive-carousel-override.scss';

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

  const providerId = Number(params.id);
  const groupedDataFields = groupBy(datafield.entities, property('type'));

  const provider = providerStore.entities[providerId];

  async function getPathway(_pathwayId) {
    const response = await axiosInstance.get(
      `/pathways/${_pathwayId}?scope=with_details`
    );
    pathwayStore.addOne(response.data);
  }

  async function getProvider(_providerId) {
    const response = await axiosInstance.get(
      `/providers/${_providerId}?scope=with_details`
    );
    providerStore.addOne(response.data);
  }

  useEffect(() => {
    if (dataFieldPayload) {
      datafield.addMany(dataFieldPayload);
    }
    if (offerPayload) {
      offerStore.addMany(offerPayload);
    }
    if (!provider || !provider.Offers || !provider.Pathways) {
      getProvider(providerId);
    }
  }, [dataFieldPayload, offerPayload, provider]);

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
        <section style={{ maxWidth: 896 }}>
          {(Offers.length &&
            Offers.map((o, index) => {
              let p = null;
              if (o && o.provider_id) {
                p = providerStore.entities[o.provider_id];
              }
              return (
                <>
                  <TitleDivider
                    title={'OFFERS'}
                    align="center"
                    classNames={{ middleSpan: 'text-base' }}
                  />
                  <InfoCard
                    className="mb-4"
                    key={index}
                    data={o}
                    provider={p}
                    groupedDataFields={groupedDataFields}
                    actions={[
                      <Link to={o && o.id ? `/home/offer/${o.id}` : null}>
                        View
                      </Link>,
                    ]}
                  />
                </>
              );
            })) ||
            null}
        </section>
        <section style={{ maxWidth: 896 }}>
          {(Pathways.length &&
            Pathways.map((pathway, index) => {
              if (!pathwayStore.entities[pathway.id]) {
                getPathway(pathway.id);
              }
              let p = null;
              if (pathway && pathway.provider_id) {
                p = providerStore.entities[pathway.provider_id];
                if (!p) {
                  getProvider(pathway.provider_id);
                }
              }
              return (
                <>
                  <TitleDivider
                    title={'PATHWAYS'}
                    align="center"
                    classNames={{ middleSpan: 'text-base' }}
                  />
                  <InfoCard
                    className="mb-4"
                    key={index}
                    data={pathway}
                    provider={p}
                    groupedDataFields={groupedDataFields}
                    actions={[
                      <Link
                        to={
                          pathway && pathway.id
                            ? `/home/pathway/${pathway.id}`
                            : null
                        }
                      >
                        View
                      </Link>,
                    ]}
                  />
                </>
              );
            })) ||
            null}
        </section>
      </InfoLayout>
    </div>
  );
}
