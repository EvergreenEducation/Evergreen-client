import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { groupBy, property, uniqueId } from 'lodash';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { TitleDivider } from 'components/shared';
import { InfoCard } from 'components/student';
import UserPathway from 'components/student/user-pathway/UserPathway/UserPathway';
import 'assets/scss/responsive-carousel-override.scss';

export default function (props) {
  const { session, pathway } = props;
  const {
    offer: offerStore,
    datafield,
    pathway: pathwayStore,
  } = useGlobalStore();

  const groupedDataFields = groupBy(datafield.entities, property('type'));
  const pathwayId = pathway ? pathway.id : null;

  const getOffer = async (offerId) => {
    const { data } = await axiosInstance.get(
      `/offers/${offerId}?scope=with_details`
    );
    offerStore.addOne(data);
  };

  const getPathway = async (_pathwayId) => {
    if (!_pathwayId) {
      return null;
    }
    if (!pathwayStore.entities[_pathwayId]) {
      const { data } = await axiosInstance.get(
        `/pathways/${pathwayId}?scope=with_details`
      );
      pathwayStore.addOne(data);
    }
  };

  useEffect(() => {
    getPathway(pathwayId);
  }, []);

  if (!pathway) {
    return null;
  }

  let groupsOfOffers = {};
  let groupKeys = [];

  if (pathway && pathway.GroupsOfOffers) {
    groupsOfOffers = groupBy(pathway.GroupsOfOffers, 'group_name');
    groupKeys = Object.keys(groupsOfOffers);
  }

  return (
    <div className="flex flex-col items-center">
      <UserPathway
        title={pathway && pathway.name ? pathway.name : '---'}
        data={pathway}
        groupedDataFields={groupedDataFields}
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
                  {group.map((g, idx) => {
                    if (!g) {
                      return null;
                    }
                    let p = null;
                    const offer = offerStore.entities[g.offer_id];
                    if (!offer) {
                      getOffer(g.offer_id);
                    }
                    if (offer && offer.provider_id) {
                      p = offer.Provider;
                    }
                    return (
                      <Link
                        key={idx}
                        to={offer && offer.id ? `/home/offer/${offer.id}` : '/'}
                        disabled={offer && offer.id ? false : true}
                      >
                        <InfoCard
                          className="mb-4"
                          data={offer}
                          provider={p}
                          key={uniqueId('card_')}
                          groupedDataFields={groupedDataFields}
                        />
                      </Link>
                    );
                  })}
                </div>
              );
            })) ||
            null}
        </section>
      </UserPathway>
    </div>
  );
}
