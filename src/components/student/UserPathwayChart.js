import React from 'react';
import { Bar } from 'react-chartjs-2';
import { head, each } from 'lodash';

export default function (props) {
  const { group, groupedBySemester, enrollmentsByOfferId } = props;

  const firstGroup = head(group);

  // const semesters = Object.keys(groupedBySemester);

  let enrolled = {
    fall: 0,
    winter: 0,
    spring: 0,
    summer: 0,
  };
  let failed = {
    fall: 0,
    winter: 0,
    spring: 0,
    summer: 0,
  };
  let passed = {
    fall: 0,
    winter: 0,
    spring: 0,
    summer: 0,
  };

  each(groupedBySemester, (g) => {
    each(g, (offerPathway) => {
      const { offer_id, semester } = offerPathway;
      const enrollments = enrollmentsByOfferId[offer_id];
      each(enrollments, (en) => {
        if (en.status === 'Activated' || en.status === 'Approvied') {
          enrolled[semester] += 1;
        } else if (en.status === 'Completed') {
          passed[semester] += 1;
        } else {
          failed[semester] -= 1;
        }
      });
    });
  });

  const data = {
    labels: ['fall', 'winter', 'spring', 'summer'],
    datasets: [
      {
        label: 'Enrolled',
        backgroundColor: 'rgb(0,0,255)',
        data: Object.values(enrolled),
      },
      {
        label: ['Failed'],
        backgroundColor: 'rgb(255,99,132)',
        data: Object.values(failed),
      },
      {
        label: ['Passed'],
        backgroundColor: 'rgb(214,233,198)',
        data: Object.values(passed),
      },
    ],
  };

  const options = {
    maintainAspectRatio: true,
    scales: {
      yAxes: [
        {
          stacked: true,
        },
      ],
      xAxes: [
        {
          stacked: true,
        },
      ],
    },
  };

  return (
    <div className="block bg-white" style={{ height: 400 }}>
      <span className="text-center font-bold">
        {firstGroup.group_name || null}
      </span>
      <Bar data={data} width={100} height={50} options={options} />
    </div>
  );
}
