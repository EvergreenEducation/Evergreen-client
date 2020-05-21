import React from 'react';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';

export default function (props) {
  const { pathway } = props;
  const { start_date } = pathway;

  const firstYear = dayjs(start_date).get('year');

  const data = {
    labels: [firstYear, firstYear + 1, firstYear + 2, firstYear + 3],
    datasets: [
      {
        label: 'Dummy dataset',
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
        data: [1010, 1500, 2000, 1300],
      },
    ],
  };

  const options = {
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
    <div className="block bg-white">
      <Line data={data} options={options} />
    </div>
  );
}
