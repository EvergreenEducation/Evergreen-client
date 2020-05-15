import React, { useEffect, useState } from 'react';
import { imported } from 'react-imported-component/macro';
import { Card, Layout, Tooltip, Button, Col } from 'antd';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import useGlobalStore from 'store/GlobalStore';
import { EnrollmentTable } from 'components/enrollment';
import { LogOutTopbar, SearchHeader } from 'components/shared';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import matchSorter from 'match-sorter';

const ProviderUpdateContainer = imported(() =>
  import('components/provider/ProviderUpdateContainer')
);

configure({
  axios: axiosInstance,
});

const { Content } = Layout;

export default function EnrollmentContainer({
  role,
  openProviderUpdateModal,
  providerId,
}) {
  const [searchString, setSearchString] = useState('');
  const [activateCreditAssignment, setActivateCreditAssignment] = useState(
    false
  );
  const history = useHistory();
  const location = useLocation();
  const { enrollment: enrollmentStore } = useGlobalStore();

  const query = new URLSearchParams(location.search);
  const offer = Number(query.get('offer'));

  const getEnrollmentsUrl = () => {
    const url = '/enrollments';

    if (role === 'provider') {
      return `${url}?provider_id=${providerId}`;
    }

    return url;
  };

  const [{ data: enrollmentBody, error: enrollmentError }] = useAxios(
    getEnrollmentsUrl()
  );

  if (enrollmentError) {
    history.push('/error/500');
  }

  useEffect(() => {
    if (enrollmentBody) {
      enrollmentStore.addMany(enrollmentBody);
    }
  }, [enrollmentBody]);

  const handleDataAfterSearch = (data, keys = ['name', 'keywords']) => {
    const results = matchSorter(data, searchString, { keys });
    return results;
  };

  const handleDataSearch = (searchVal) => {
    return setSearchString(searchVal);
  };

  let dataSource = handleDataAfterSearch(
    Object.values(enrollmentStore.entities),
    ['Offer.name']
  );

  if (role === 'provider') {
    dataSource = dataSource.filter(
      (enrollment) => enrollment.provider_id === providerId
    );
  }

  return (
    <Layout className="bg-transparent">
      <LogOutTopbar
        renderNextToLogOut={
          role === 'provider' && (
            <Tooltip title="Update my information">
              <Button
                className="rounded mr-2 px-4"
                type="primary"
                size="small"
                onClick={() => openProviderUpdateModal()}
                onMouseEnter={() => ProviderUpdateContainer.preload()}
              >
                <FontAwesomeIcon
                  className="text-white relative"
                  style={{ left: 2 }}
                  icon={faUserEdit}
                />
              </Button>
            </Tooltip>
          )
        }
      >
        <Col span={14}>
          <SearchHeader title="ENROLLMENTS" onSearch={handleDataSearch}>
            <Button
              className="rounded text-xs flex items-center ml-2"
              type="primary"
              size="small"
              onClick={() =>
                setActivateCreditAssignment(!activateCreditAssignment)
              }
            >
              {activateCreditAssignment ? 'LOCK CREDIT' : 'ASSIGN CREDIT'}
            </Button>
          </SearchHeader>
        </Col>
      </LogOutTopbar>
      <Content className="p-6">
        <Card className="shadow-md rounded-md">
          <EnrollmentTable
            dataSource={dataSource}
            activateCreditAssignment={activateCreditAssignment}
            offer={offer}
          />
        </Card>
      </Content>
    </Layout>
  );
}
