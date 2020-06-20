import React from 'react';
import { head, startCase, toLower } from 'lodash';
import { Bar } from 'react-chartjs-2';

export default function (props) {
  const { groupName, className, data, redraw = false } = props;

  const options = {
    plugins: [],
    responsive: true,
    maintainAspectRatio: true,
    tooltips: {
      callbacks: {
        title: function (toolTipItem) {
          return startCase(toLower(head(toolTipItem).label));
        },
        footer: function (tooltipItem, data) {
          tooltipItem = head(tooltipItem);
          const label = tooltipItem.label;
          var statusCountString =
            data.datasets[tooltipItem.datasetIndex].label || '';
          let enrollStatus = statusCountString;

          return data.dataLookUp[`${label}-${enrollStatus}`]
            ? `Offer(s):\n - ${data.dataLookUp[`${label}-${enrollStatus}`].join(
                '\n - '
              )}`
            : '';
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
            stepSize: 1,
          },
        },
      ],
    },
  };

  return (
    <div className={`block bg-white ${className}`}>
      <span className="text-center font-bold">{groupName}</span>
      <Bar data={data} options={options} redraw={redraw} />
    </div>
  );
}
