import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Tag, Button, Input, Form } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faTimes,
  faEdit,
  faCheck,
  faCalendarAlt,
  faChartBar,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { Carousel } from 'react-responsive-carousel';
import { find, groupBy, each, uniqBy, sortBy, last, head } from 'lodash';
import axiosInstance from 'services/AxiosInstance';
import useGlobalStore from 'store/GlobalStore';
import { LearnAndEarnIcons } from 'components/shared';
import { UserPathwayChart, ExpenseEarningChart } from 'components/student';
import './user-pathway.scss';
import 'assets/scss/antd-overrides.scss';

const { TextArea } = Input;

export default function ({
  children,
  pathway = {},
  studentsPathways,
  completedEnrollments,
  enrollmentsByOfferId,
  student,
}) {
  const [totalPay, setTotalPay] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [openNotes, setOpenNotes] = useState(false);

  const [switchChart, setSwitchChart] = useState(false);
  const [toggleFilterByGroup, setToggleFilterByGroup] = useState(false);

  const [formRef, setFormRef] = useState();
  const {
    id: pathwayId,
    DataFields = [],
    Provider,
    provider_id,
    name,
    StudentsPathways,
    GroupsOfOffers,
  } = pathway;

  const { pathway: pathwayStore, offer: offerStore } = useGlobalStore();

  const { student_id } = studentsPathways.StudentPathway;

  const [form] = Form.useForm();

  const topics = DataFields.filter((d) => d.type === 'topic');

  let pathwayOfferIds = [];

  each(pathway.GroupsOfOffers, (offerGroup) => {
    if (offerGroup.offer_id) {
      pathwayOfferIds.push(offerGroup.offer_id);
    }
  });

  pathwayOfferIds = uniqBy(pathwayOfferIds);

  let latestDates = [];

  each(pathwayOfferIds, (offerId) => {
    const enrollments = sortBy(enrollmentsByOfferId[offerId], ['start_date']);
    if (last(enrollments)) {
      latestDates.push(last(enrollments).start_date);
    }
  });

  latestDates = sortBy(latestDates, ['start_date']);

  let latestEnrollmentDate = head(latestDates);
  latestEnrollmentDate = dayjs(latestEnrollmentDate).format('MMM DD, YYYY');

  const updatePathwayNotes = async (_studentId, _pathwayId) => {
    try {
      const values = await form.validateFields(['notes']);
      const response = await axiosInstance.put(
        `/students/${_studentId}/pathways/${pathwayId}?scope=with_details`,
        { notes: values.notes }
      );
      pathwayStore.updateOne(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  let notes = null;

  const _StudentsPathways = find(StudentsPathways, function (item) {
    return item.StudentPathway.student_id === student_id;
  });

  if (_StudentsPathways && _StudentsPathways.StudentPathway.notes) {
    notes = _StudentsPathways.StudentPathway.notes;
  }

  const groups = groupBy(GroupsOfOffers, 'group_name');
  const groupNames = Object.keys(groups);

  let _totalPay = 0;
  let _totalCredit = 0;
  let _totalCost = 0;
  let creditEarned = 0;

  const earningByGroup = {};

  each(Object.values(groups), function (_group, index) {
    let totalPayOfGroup = 0;

    each(_group, function (o) {
      const offer = offerStore.entities[o.offer_id];

      if (offer) {
        if (completedEnrollments[offer.id]) {
          creditEarned += offer.credit;
        }
        if (offer.pay) {
          _totalPay += offer.pay;
        }
        if (offer.credit) {
          _totalCredit += offer.credit;
        }
        if (offer.cost) {
          _totalCost += offer.cost;
        }
        if (
          completedEnrollments[offer.id] &&
          completedEnrollments[offer.id].student_id === student.id
        ) {
          totalPayOfGroup += offer.pay;
        }
      }
    });

    earningByGroup[groupNames[index]] = totalPayOfGroup;
  });

  useEffect(() => {
    if (formRef) {
      form.setFieldsValue({
        notes,
      });
    }
    if (_totalPay > 0) {
      setTotalPay(_totalPay);
    }
    if (_totalCredit > 0) {
      setTotalCredit(_totalCredit);
    }
    if (_totalCost > 0) {
      setTotalCost(_totalCost);
    }
  }, [formRef, totalPay, totalCost, totalCredit]);

  return (
    <div className="infoLayout mb-3">
      <header className="mx-auto relative bg-white pt-2">
        {
          <>
            <div className={`${!switchChart ? 'block' : 'hidden'}`}>
              <Carousel
                className={`cursor-grab mb-4 ${
                  toggleFilterByGroup ? 'block' : 'hidden'
                }`}
                centerMode
                infiniteLoop
                centerSlidePercentage={100}
                showArrows={true}
                showIndicators={false}
                swipeable={true}
                emulateTouch={true}
                showStatus={false}
                showThumbs={false}
                swipeScrollTolerance={1}
              >
                {groupNames.map((group_name, index) => {
                  const group = groups[group_name];
                  return (
                    <UserPathwayChart
                      group={group}
                      groups={groups}
                      groupName={group_name}
                      key={index}
                      enrollmentsByOfferId={enrollmentsByOfferId}
                      student={student}
                      pathway={pathway}
                    />
                  );
                }) || 'N/A'}
              </Carousel>
              <UserPathwayChart
                className={`mb-2 ${!toggleFilterByGroup ? 'block' : 'hidden'}`}
                groups={groups}
                enrollmentsByOfferId={enrollmentsByOfferId}
                student={student}
                pathway={pathway}
              />
            </div>
            <ExpenseEarningChart
              className={`${!switchChart ? 'hidden' : 'block'}`}
              groupNames={groupNames}
              pathway={pathway}
              groups={groups}
              enrollmentsByOfferId={enrollmentsByOfferId}
              student={student}
              earningByGroup={earningByGroup}
            />
          </>
        }
        <div className="flex bg-white justify-end px-2">
          {!switchChart && (
            <Button
              className="flex justify-center items-center mx-2"
              type={toggleFilterByGroup ? 'primary' : 'default'}
              size="small"
              onClick={() => setToggleFilterByGroup(!toggleFilterByGroup)}
            >
              Filter by group
            </Button>
          )}
          <Button
            className="rounded flex justify-center items-center"
            style={{ paddingRight: '1rem', paddingLeft: '1rem' }}
            type="primary"
            size="small"
            onClick={() => setSwitchChart(!switchChart)}
            icon={
              !switchChart ? (
                <FontAwesomeIcon icon={faChartBar} />
              ) : (
                <FontAwesomeIcon icon={faChartLine} />
              )
            }
          />
        </div>
        <span
          className="block text-white text-center text-lg text-white w-full bottom-0 p-3 mt-2"
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
          }}
        >
          {name || '---'}
        </span>
      </header>
      <section
        className="bg-white px-2 pb-4"
        style={{
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem',
        }}
      >
        <Row className="py-2">
          <Col span={12}>
            {Provider && Provider.name ? (
              <Link
                className={provider_id ? '' : 'pointer-events-none'}
                to={`/home/provider/${provider_id}`}
              >
                {Provider.name}
              </Link>
            ) : null}
          </Col>
          <Col span={12} className="flex flex-row-reverse items-center">
            {Provider && Provider.location && (
              <span className="block ml-1">{Provider.location}</span>
            )}
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </Col>
        </Row>
        <hr />
        <Row className="py-2">
          <Col span={12} className="flex items-center">
            <LearnAndEarnIcons learnAndEarn={pathway.learn_and_earn} />
          </Col>
          <Col span={12} className="flex flex-col items-right text-right">
            <span className="text-gray-600">TOPICS</span>
            <div className="flex flex-row-reverse flex-wrap items-right">
              {topics.map((t, index) => {
                if (t.type !== 'topic') {
                  return null;
                }
                return (
                  <Tag
                    className="mr-0 ml-1 mb-1"
                    color={index % 2 ? 'blue' : 'orange'}
                    key={index.toString()}
                  >
                    {t.name}
                  </Tag>
                );
              })}
            </div>
          </Col>
        </Row>
        <hr />
        <Row className="mt-2 mb-1">
          <Col span={8}>Cost : {totalCost > 0 ? `$${totalCost}` : '---'}</Col>
          <Col span={8} className="flex justify-center">
            Credit : {totalCredit > 0 ? `${creditEarned}` : '---'}/
            {totalCredit > 0 ? `${totalCredit}` : '---'}
          </Col>
          <Col span={8} className="flex flex-row-reverse">
            Pay : {totalPay > 0 ? `$${totalPay}` : '---'}
          </Col>
        </Row>
        <Row className="mt-1 mb-2">
          <Col span={12} className="flex flex-row items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
            <span>{latestEnrollmentDate || '---'}</span>
          </Col>
          <Col span={12} className="flex flex-row items-center"></Col>
        </Row>
        <hr />
        <Col span={24} className="mt-2">
          <Row className="justify-between items-center">
            <span className="block my-auto">Notes:</span>
            {!openNotes && (
              <Button
                className="pl-2 rounded"
                type="primary"
                size="small"
                shape="circle"
                onClick={() => setOpenNotes(true)}
                icon={
                  <FontAwesomeIcon
                    className="relative"
                    style={{ left: 1 }}
                    icon={faEdit}
                  />
                }
              />
            )}
            {openNotes && (
              <div>
                <Button
                  className="px-2 rounded mr-1"
                  type="primary"
                  size="small"
                  shape="circle"
                  onClick={() => updatePathwayNotes(student_id, pathwayId)}
                  icon={<FontAwesomeIcon icon={faCheck} />}
                />
                <Button
                  className="px-2 rounded"
                  type="default"
                  size="small"
                  danger
                  shape="circle"
                  onClick={() => setOpenNotes(false)}
                  icon={<FontAwesomeIcon icon={faTimes} />}
                />
              </div>
            )}
          </Row>
          {openNotes && (
            <Form ref={setFormRef} form={form} className="mt-2">
              <Form.Item name="notes">
                <TextArea className="rounded shadow-inner" />
              </Form.Item>
            </Form>
          )}
          {!openNotes && <p>{notes}</p>}
        </Col>
      </section>
      <section>{children}</section>
    </div>
  );
}
