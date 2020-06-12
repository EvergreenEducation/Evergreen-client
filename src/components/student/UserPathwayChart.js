import React from 'react';
import { Bar } from 'react-chartjs-2';
import { head, startCase, toLower } from 'lodash';

export default function (props) {
  const { groupName, className, data } = props;

  const options = {
    tooltips: {
      callbacks: {
        title: function (toolTipItem) {
          return startCase(toLower(head(toolTipItem).label));
        },
      },
    },
    scales: {
      yAxes: [
        {
          stacked: true,
          ticks: {
            stepSize: 1,
          },
        },
      ],
      xAxes: [
        {
          stacked: true,
          ticks: {
            callback: function (value, index, values) {
              return startCase(toLower(value));
            },
          },
        },
      ],
    },
  };

  return (
    <div className={`block bg-white ${className}`}>
      <span className="text-center font-bold">{groupName}</span>
      <Bar data={data} options={options} />
    </div>
  );
}
