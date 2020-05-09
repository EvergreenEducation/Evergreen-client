import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Alert, Button } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import useGlobalStore from 'store/GlobalStore';
import { isEqual } from 'lodash';
import { TitleDivider } from 'components/shared';
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
  const {
    offer: offerStore,
    provider: providerStore,
    datafield: datafieldStore,
    pathway: pathwayStore,
  } = useGlobalStore();

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

  useEffect(() => {
    if (studentPayload) {
      const isNewStudentInfo = isEqual(student, studentPayload);
      if (!isNewStudentInfo) {
        setStudent(studentPayload);
      }
    }
  }, [studentPayload]);
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
        student.StudentPathways.map((pathway) => {
          const pathwayEntity = pathwayStore.entities[pathway.id];
          if (!pathwayEntity) {
            getPathway(pathway.id);
          }
          return (
            <section className="bg-white mb-2 rounded">
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
                  pathwayEntity.GroupsOfOffers.length &&
                  pathwayEntity.GroupsOfOffers.map((g) => {
                    const offer = offerStore.entities[g.offer_id];
                    if (!offer) {
                      getOffer(g.offer_id);
                    }
                    return (
                      <Collapse className="rounded mb-2">
                        <Panel className="rounded" header={g.group_name}>
                          <div className="flex flex-row justify-between">
                            <span className="block">{offer.name}</span>
                            <Button
                              type="primary"
                              className="rounded"
                              size="small"
                            >
                              <Link
                                className="text-blue"
                                to={`/home/offer/${offer.id}`}
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
                          </div>
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
      <Alert
        className="mx-auto text-center rounded"
        type="info"
        message="You haven't enrolled in any offers yet."
      />
    </main>
  );
}
