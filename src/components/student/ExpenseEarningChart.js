import React from 'react';
import { Line } from 'react-chartjs-2';
import { each, head } from 'lodash';

export default function (props) {
  const { pathway, className, earningByGroup } = props;
  const { group_sort_order = [] } = pathway;

  const years = [];

  const yData = [];

  each(group_sort_order, (groupName, index) => {
    const totalPay = earningByGroup[groupName];
    years.push(`Year ${index + 1}`);
    yData.push(totalPay);
  });

  const data = {
    labels: years,
    datasets: [
      {
        label: 'Earnings',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: yData,
      },
    ],
  };

  const options = {
    tooltips: {
      callbacks: {
        title: function (toolTipItem) {
          let label = head(toolTipItem).label;
          let yearNum = Number(label[label.length - 1]);
          let index = yearNum - 1;
          return group_sort_order[index];
        },
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            stepSize: 1000,
            callback: function (value) {
              return '$' + value;
            },
          },
        },
      ],
    },
  };
  return (
    <div className={`block bg-white ${className}`}>
      <Line data={data} options={options} />
    </div>
  );
}
