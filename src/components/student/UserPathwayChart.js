import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { head, startCase, toLower } from 'lodash';
import axiosInstance from 'services/AxiosInstance';

export default function (props) {
  const { groupName, pathway, student, className } = props;
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const getChartData = async (student_id, pathway_id, group_name) => {
      let sendingBody = {
        student_id,
        pathway_id,
      };

      if (group_name) {
        sendingBody = {
          ...sendingBody,
          group_name,
        };
      }

      const { data } = await axiosInstance.post(
        '/pathways/generate_userpathway_chart_data',
        sendingBody
      );

      setChartData(data);
    };

    if (groupName) {
      getChartData(student.id, pathway.id, groupName);
    } else {
      getChartData(student.id, pathway.id);
    }
  }, [student.id, pathway.id, groupName]);

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
      <Bar data={chartData} options={options} />
    </div>
  );
}
