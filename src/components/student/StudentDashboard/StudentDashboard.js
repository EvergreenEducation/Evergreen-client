import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import {
  isEqual,
  groupBy,
  filter,
  sortBy,
  flow,
  mapValues,
  uniqueId,
  property,
  last,
} from 'lodash';
import axiosInstance from 'services/AxiosInstance';
import useGlobalStore from 'store/GlobalStore';
import { TitleDivider } from 'components/shared';
import { InfoCard } from 'components/student';
import UserPathwayContainer from 'components/student/user-pathway/UserPathwayContainer';
import './student-dashboard.scss';

configure({
  axios: axiosInstance,
});

export default function (props) {
  const { session = {} } = props;
  const studentId = session.student_id;
  const [student, setStudent] = useState({});
  const [{ data: studentPayload }] = useAxios(
    `/students/${studentId}?scope=with_details`
  );
  const {
    offer: offerStore,
    pathway: pathwayStore,
    enrollment: enrollmentStore,
    datafield,
  } = useGlobalStore();

  const groupedDataFields = groupBy(datafield.entities, property('type'));

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

  const getEnrollments = async (studentId) => {
    if (!studentId) {
      return null;
    }

    if (!Object.keys(enrollmentStore.entities).length) {
      const studentEnrollments = await axiosInstance.get(
        `/enrollments?student_id=${studentId}`
      );

      const unenrollments = await axiosInstance.get(
        `/enrollments?student_id=${null}`
      );

      if (studentEnrollments.data.length) {
        enrollmentStore.addMany(studentEnrollments.data);
      }

      if (unenrollments.data.length) {
        enrollmentStore.addMany(unenrollments.data);
      }
    }
  };

  let completedEnrollments = [];
  let enrollmentsByOfferId = [];
  let myEnrollments = [];
  const enrollmentEntities = Object.values(enrollmentStore.entities);

  if (studentId) {
    for (let i = 0; i < enrollmentEntities.length; i++) {
      if (!enrollmentEntities[i]) {
        break;
      }

      if (
        enrollmentEntities[i].status === 'Completed' &&
        enrollmentEntities[i].student_id === studentId
      ) {
        completedEnrollments.push(enrollmentEntities[i]);
      }

      if (enrollmentEntities[i].student_id === null) {
        enrollmentsByOfferId.push(enrollmentEntities[i]);
      }

      if (enrollmentEntities[i].student_id === studentId) {
        myEnrollments.push(enrollmentEntities[i]);
        enrollmentsByOfferId.push(enrollmentEntities[i]);
      }
    }
  }

  completedEnrollments = groupBy(completedEnrollments, 'offer_id');
  enrollmentsByOfferId = groupBy(enrollmentsByOfferId, 'offer_id');
  myEnrollments = flow([
    (enrs) => groupBy(enrs, 'offer_id'),
    (enrs) =>
      mapValues(enrs, (enr) => sortBy(enr, ['start_date', 'updatedAt'])),
  ])(myEnrollments);

  useEffect(() => {
    if (studentPayload) {
      const isNewStudentInfo = isEqual(student, studentPayload);
      if (!isNewStudentInfo) {
        setStudent(studentPayload);
      }
    }
    getEnrollments(studentId);
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
              completedEnrollments={completedEnrollments}
              enrollmentsByOfferId={enrollmentsByOfferId}
              myEnrollments={myEnrollments}
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
          let p = null;
          let latestEnrollment = null;
          if (!offer) {
            getOffer(offerId);
          }
          if (offer && offer.provider_id) {
            p = offer.Provider;
          }
          if (offerId && myEnrollments[offerId]) {
            latestEnrollment = last(myEnrollments[offerId]);
          }
          return (
            <Link to={`/home/offer/${offer.id}`} key={index}>
              <InfoCard
                className="mb-4"
                data={offer}
                provider={p}
                key={uniqueId('card_')}
                groupedDataFields={groupedDataFields}
                latestEnrollment={latestEnrollment}
                enableStatus={true}
              />
            </Link>
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
