import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import { isEqual, groupBy, filter } from 'lodash';
import axiosInstance from 'services/AxiosInstance';
import useGlobalStore from 'store/GlobalStore';
import { TitleDivider } from 'components/shared';
import { SmallInfoCard } from 'components/student';
import UserPathwayContainer from 'components/student/user-pathway/UserPathwayContainer';
import './student-dashboard.scss';

configure({
  axios: axiosInstance,
});

export default function (props) {
  const { session = {}, toggeables, setToggeables } = props;
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
          if (!pathwayEntity) {
            getPathway(pathway.id);
          }
          return (
            <UserPathwayContainer
              {...props}
              key={idx}
              pathway={pathwayEntity}
              student={student}
            />
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
