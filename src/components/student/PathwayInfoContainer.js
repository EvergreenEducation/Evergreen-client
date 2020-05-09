import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxios, { configure } from 'axios-hooks';
import { groupBy, property, uniqueId } from 'lodash';
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
    session,
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
  const [{ data: providerPayload }] = useAxios('/providers?scope=with_details');

  const pathwayId = Number(params.id);
  const groupedDataFields = groupBy(datafield.entities, property('type'));

  const pathway = pathwayStore.entities[pathwayId];

  async function getOffer(offerId) {
    const response = await axiosInstance.get(
      `/offers/${offerId}?scope=with_details`
    );
    offerStore.addOne(response.data);
  }

  useEffect(() => {
    if (dataFieldPayload) {
      datafield.addMany(dataFieldPayload);
    }
    if (providerPayload) {
      providerStore.addMany(providerPayload);
    }
    if (!pathway) {
      async function getPathway(_pathwayId) {
        const response = await axiosInstance.get(
          `/pathways/${_pathwayId}?scope=with_details`
        );
        pathwayStore.addOne(response.data);
      }
      getPathway(pathwayId);
    }
  }, [dataFieldPayload, providerPayload, pathway]);

  let groupsOfOffers = {};
  let groupKeys = [];

  if (pathway && pathway.GroupsOfOffers) {
    groupsOfOffers = groupBy(pathway.GroupsOfOffers, 'group_name');
    groupKeys = Object.keys(groupsOfOffers);
  }

  return (
    <div className="flex flex-col items-center">
      <InfoLayout
        title={pathway && pathway.name ? pathway.name : '---'}
        data={pathway}
        groupedDataFields={groupedDataFields}
        type="pathway"
        session={session}
      >
        <section style={{ maxWidth: 896 }}>
          {(groupKeys.length && (
            <TitleDivider
              title={'GROUPS OF OFFERS'}
              align="center"
              classNames={{ middleSpan: 'text-base' }}
            />
          )) ||
            null}
          {(groupKeys.length &&
            groupKeys.map((key, index) => {
              const group = groupsOfOffers[key];
              return (
                <div key={uniqueId('div_')}>
                  <TitleDivider
                    title={key}
                    align="center"
                    classNames={{
                      middleSpan:
                        'text-base bg-teal-600 px-2 rounded text-white',
                    }}
                  />
                  {group.map((g) => {
                    if (!g) {
                      return null;
                    }
                    let p = null;
                    const offer = offerStore.entities[g.offer_id];
                    if (!offer) {
                      getOffer(g.offer_id);
                    }
                    if (offer && offer.provider_id) {
                      p = providerStore.entities[offer.provider_id];
                    }
                    return (
                      <InfoCard
                        className="mb-4"
                        data={offer}
                        provider={p}
                        key={uniqueId('card_')}
                        groupedDataFields={groupedDataFields}
                        actions={[
                          <Link
                            to={
                              offer && offer.id
                                ? `/home/offer/${offer.id}`
                                : '/'
                            }
                            disabled={offer && offer.id ? false : true}
                          >
                            View
                          </Link>,
                        ]}
                      />
                    );
                  })}
                </div>
              );
            })) ||
            null}
        </section>
      </InfoLayout>
    </div>
  );
}
