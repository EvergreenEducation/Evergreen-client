import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxios, { configure } from 'axios-hooks';
import { groupBy, property } from 'lodash';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { TitleDivider } from 'components/shared';
import { OfferCard, InfoLayout } from 'components/student';
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

  const pathwayId = Number(params.id);
  const groupedDataFields = groupBy(datafield.entities, property('type'));

  const pathway = pathwayStore.entities[pathwayId];

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
      >
        <TitleDivider
          title={'GROUPS OF OFFERS'}
          align="center"
          classNames={{ middleSpan: 'text-base' }}
        />
        <section style={{ maxWidth: 896 }}>
          {(groupKeys.length &&
            groupKeys.map((key, index) => {
              const group = groupsOfOffers[key];
              return (
                <div>
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
                    if (offer && offer.provider_id) {
                      p = providerStore.entities[offer.provider_id];
                    }
                    return (
                      <OfferCard
                        className="mb-4"
                        offer={offer}
                        provider={p}
                        key={index}
                        groupedDataFields={groupedDataFields}
                        actions={[
                          <Link
                            to={
                              offer && offer.id
                                ? `/student/offer/${offer.id}`
                                : null
                            }
                          >
                            View
                          </Link>,
                        ]}
                      />
                    );
                  })}
                </div>
              );
            })) || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </section>
      </InfoLayout>
    </div>
  );
}
