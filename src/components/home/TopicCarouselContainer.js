import React, { useEffect } from 'react';
import useAxios, { configure } from 'axios-hooks';
import { Card } from 'antd';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import { Carousel } from 'react-responsive-carousel';

configure({
  axios: axiosInstance,
});

export default function () {
  const { datafield } = useGlobalStore();
  const topics = Object.values(datafield.entities);
  const [{ data: dataFieldPayload }] = useAxios('/datafields?type=topic');

  useEffect(() => {
    if (dataFieldPayload) {
      datafield.addMany(dataFieldPayload);
    }
  }, [dataFieldPayload]);

  return (
    <div>
      <h1>Offers by Topics</h1>
      <Carousel>
        {topics.map((topic, index) => {
          if (!topic) {
            return null;
          }
          return <Card key={index}>{topic.name}</Card>;
        })}
      </Carousel>
    </div>
  );
}
