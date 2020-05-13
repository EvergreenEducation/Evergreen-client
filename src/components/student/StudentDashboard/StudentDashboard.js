import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Alert, Button, message } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import { isEqual, groupBy, filter } from 'lodash';
import axiosInstance from 'services/AxiosInstance';
import useGlobalStore from 'store/GlobalStore';
import { TitleDivider } from 'components/shared';
import { SmallInfoCard } from 'components/student';
import './student-dashboard.scss';

configure({
  axios: axiosInstance,
});

const { Panel } = Collapse;

export default function ({ session = {}, toggeables, setToggeables }) {
  const studentId = session.student_id;
  const [student, setStudent] = useState({});
  const [{ data: studentPayload }] = useAxios(
    `/students/${studentId}?scope=with_details`
  );
  const { offer: offerStore, pathway: pathwayStore } = useGlobalStore();

  async function getPathway(pathwayId) {
    const response = await axiosInstance.get(
      `/pathways/${pathwayId}?scope=with_details`
    );
    pathwayStore.addOne(response.data);
  }

  async function getOffer(offerId) {
    const response = await axiosInstance.get(
      `/offers/${offerId}?scope=with_details`
    );
    offerStore.addOne(response.data);
  }

  const enrollOffer = async (offer) => {
    if (!session.student_id) {
      return;
    }
    if (!offer || !offer.id) {
      return;
    }
    const studentId = session.student_id;
    try {
      const response = await axiosInstance.put(
        `/students/${studentId}/offers/${offer.id}/provider/${offer.provider_id}/enroll`
      );
      if (response.status === 200) {
        message.success(`You've enrolled in ${offer.name}`);
      }
      if (response.status === 201) {
        message.info(
          `We'll notify the provider about your enrollment in ${offer.name}`
        );
      }
      return response;
    } catch (e) {
      console.error(e);
      if (e.response.status === 400) {
        message.error(
          'There are no enrollments available. Please contact the provider.'
        );
      }
    }
  };

  useEffect(() => {
    if (studentPayload) {
      const isNewStudentInfo = isEqual(student, studentPayload);
      if (!isNewStudentInfo) {
        setStudent(studentPayload);
      }
    }
  }, [studentPayload]);

  let offerIds = filter(student.Enrollments || [], ['status', 'Activated']);
  offerIds = groupBy(offerIds, 'offer_id');
  offerIds = Object.keys(offerIds);

  return (
    <main className="pb-4">
      <TitleDivider
        title={'Enrolled Pathways'}
        align="center"
        classNames={{ middleSpan: 'text-base' }}
      />
      {(student &&
        student.StudentPathways &&
        student.StudentPathways.length &&
        student.StudentPathways.map((pathway, idx) => {
          const pathwayEntity = pathwayStore.entities[pathway.id];
          let groupsOfOffers = {};
          let groupNames = [];
          if (!pathwayEntity) {
            getPathway(pathway.id);
          }
          if (
            pathwayEntity &&
            pathwayEntity.GroupsOfOffers &&
            pathwayEntity.GroupsOfOffers.length
          ) {
            groupsOfOffers = groupBy(
              pathwayEntity.GroupsOfOffers,
              'group_name'
            );
            groupNames = Object.keys(groupsOfOffers);
          }
          return (
            <section className="bg-white mb-2 rounded" key={idx}>
              <div className="px-2 pt-2">
                <span className="block text-lg">
                  <Link
                    to={`/home/pathway/${pathway.id}`}
                    onClick={() =>
                      setToggeables({ ...toggeables, studentDashboard: false })
                    }
                  >
                    {pathway.name}
                  </Link>
                </span>
                <span className="block">
                  <Link
                    to={`/home/provider/${pathway.Provider.id}`}
                    onClick={() =>
                      setToggeables({ ...toggeables, studentDashboard: false })
                    }
                  >
                    {pathway.Provider.name}
                  </Link>
                </span>
              </div>
              <TitleDivider
                title={'Groups of Offers'}
                align="center"
                classNames={{ middleSpan: 'text-base' }}
              />
              <div className="px-2 pb-2">
                {(pathwayEntity &&
                  pathwayEntity.GroupsOfOffers &&
                  groupNames.length &&
                  groupNames.map((key, index) => {
                    const group = groupsOfOffers[key];
                    return (
                      <Collapse className="rounded mb-2" key={index}>
                        <Panel className="rounded" header={key}>
                          {group.map((g, _index) => {
                            if (!g) {
                              return null;
                            }
                            const offer = offerStore.entities[g.offer_id];
                            if (!offer) {
                              getOffer(g.offer_id);
                            }
                            return (
                              <SmallInfoCard
                                key={_index}
                                offer={offer}
                                color={_index % 2 ? 'primary' : 'secondary'}
                              >
                                <Button
                                  type="link"
                                  className="rounded mr-2"
                                  size="small"
                                >
                                  <Link
                                    className="text-blue"
                                    to={offer ? `/home/offer/${offer.id}` : '/'}
                                    onClick={() =>
                                      setToggeables({
                                        ...toggeables,
                                        studentDashboard: false,
                                      })
                                    }
                                  >
                                    View
                                  </Link>
                                </Button>
                                <Button
                                  type="primary"
                                  className="rounded"
                                  size="small"
                                  onClick={() => enrollOffer(offer)}
                                >
                                  Enroll
                                </Button>
                              </SmallInfoCard>
                            );
                          })}
                        </Panel>
                      </Collapse>
                    );
                  })) || (
                  <Alert
                    className="mx-auto text-center rounded"
                    type="info"
                    message="This pathway doesn't have any groups of offers yet."
                  />
                )}
              </div>
            </section>
          );
        })) || (
        <Alert
          className="mx-auto text-center rounded"
          type="info"
          message="You haven't enrolled in any pathways yet."
        />
      )}
      <TitleDivider
        title={'Enrolled Offers'}
        align="center"
        classNames={{ middleSpan: 'text-base' }}
      />
      {(offerIds.length &&
        offerIds.map((offerId, index) => {
          offerId = Number(offerId);
          const offer = offerStore.entities[offerId];
          if (!offer) {
            getOffer(offerId);
          }
          return (
            <SmallInfoCard
              key={index}
              offer={offer}
              color={index % 2 ? 'primary' : 'secondary'}
            >
              <Button type="primary" className="rounded mr-2" size="small">
                <Link
                  className="text-blue"
                  to={offer ? `/home/offer/${offer.id}` : '/'}
                  onClick={() =>
                    setToggeables({
                      ...toggeables,
                      studentDashboard: false,
                    })
                  }
                >
                  View
                </Link>
              </Button>
            </SmallInfoCard>
          );
        })) || (
        <Alert
          className="mx-auto text-center rounded"
          type="info"
          message="You haven't enrolled in any offers yet."
        />
      )}
    </main>
  );
}
