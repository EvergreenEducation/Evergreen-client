import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { groupBy, property, uniqueId, keyBy } from 'lodash';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { TitleDivider } from 'components/shared';
import { InfoCard } from 'components/student';
import UserPathway from 'components/student/user-pathway/UserPathway/UserPathway';
import 'assets/scss/responsive-carousel-override.scss';

export default function (props) {
  const { session, pathway, student } = props;
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

  let studentsPathways = null;

  const keyedByStudentPathwayId = keyBy(
    student.StudentPathways,
    'StudentPathway.pathway_id'
  );

  if (keyedByStudentPathwayId[pathway.id]) {
    studentsPathways = keyedByStudentPathwayId[pathway.id];
  }

  if (pathway && pathway.group_sort_order && pathway.group_sort_order.length) {
    groupKeys = pathway.group_sort_order;
  }

  return (
    <div className="flex flex-col items-center">
      <UserPathway
        title={pathway && pathway.name ? pathway.name : '---'}
        data={pathway}
        groupedDataFields={groupedDataFields}
        session={session}
        studentsPathways={studentsPathways}
      >
        <section style={{ maxWidth: 896 }}>
          {(groupKeys && groupKeys.length && (
            <TitleDivider
              title={'GROUPS OF OFFERS'}
              align="center"
              classNames={{ middleSpan: 'text-base' }}
            />
          )) ||
            null}
          {(groupKeys &&
            groupKeys.length &&
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
                      <Link to={`/home/offer/${offer.id}`} key={idx}>
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
