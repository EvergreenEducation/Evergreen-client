import React from 'react';
import { Bar } from 'react-chartjs-2';
import { head } from 'lodash';
import dayjs from 'dayjs';

export default function (props) {
  const { group, groupName } = props;
  const firstGroup = head(group);
  const firstYear = dayjs(firstGroup.createdAt).get('year');
  const numOfOffers = group.length;
  const data = {
    labels: [firstYear, firstYear + 1, firstYear + 2, firstYear + 3],
    datasets: [
      {
        label: [groupName],
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [numOfOffers],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          stacked: true,
          ticks: {
            stepSize: 1,
          },
        },
      ],
    },
  };

  return (
    <div className="block bg-white" style={{ height: 400 }}>
      <Bar data={data} width={100} height={50} options={options} />
    </div>
  );
}
