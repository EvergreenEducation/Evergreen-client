import React, { useState, useEffect } from 'react';
import AuthService from 'services/AuthService';
import { withRouter, Route } from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { Layout } from 'antd';
import axiosInstance from 'services/AxiosInstance';

import ProviderStore from 'store/Provider';
import DataFieldStore from 'store/DataField';
import OfferStore from 'store/Offer';
import PathwayStore from 'store/Pathway';
import EnrollmentStore from 'store/Enrollment';
import Sidebar from 'components/Sidebar';
import 'scss/antd-overrides.scss';

const ProviderSimpleUpdateContainer = imported(() =>
  import('components/provider/ProviderSimpleUpdateContainer')
);

const ProviderUpdateContainer = imported(() =>
  import('components/provider/ProviderUpdateContainer')
);

const OfferContainer = imported(() =>
  import('components/offer/OfferContainer')
);

const EnrolledOfferContainer = imported(() =>
  import('components/enrollment/EnrolledOfferContainer')
);

const PathwayContainer = imported(() =>
  import('components/pathway/PathwayContainer')
);

function DashboardScreen(props) {
  const { role, match, location, history } = props;
  const { url: basePath } = match;

  const [modalStates, setModalStates] = useState({
    providerUpdateModal: false,
    providerSimpleUpdateModal: false,
  });

  const openProviderUpdateModal = () => {
    setModalStates({
      providerUpdateModal: true,
      providerSimpleUpdateModal: false,
    });
  };

  const myProviderId = AuthService.currentSession.provider_id;

  async function getProviderInfo(providerId) {
    const { data } = await axiosInstance(`/providers/${providerId}`);
    if (data && !data.name) {
      const modalDelay = setTimeout(() => {
        setModalStates({ ...modalStates, providerSimpleUpdateModal: true });
      }, 150);
      return () => clearTimeout(modalDelay);
    }
  }

  useEffect(() => {
    getProviderInfo(myProviderId);
  }, [myProviderId, role]);

  if (location.pathname === basePath) {
    if (role === 'provider') {
      history.push(`${basePath}/offers`);
      return;
    }
    history.push(`${basePath}/providers`);
  }

  return (
    <>
      <Layout className="w-full flex flex-row bg-gray-300 min-h-full overflow-y-auto">
        <Sidebar {...props} />
        <div className="h-min-full w-full">
          <Route
            path={`${basePath}/offers`}
            component={() => (
              <OfferContainer
                openProviderUpdateModal={openProviderUpdateModal}
                role={role}
                basePath={basePath}
                providerId={myProviderId}
              />
            )}
          />
          <Route
            path={`${basePath}/enrollments`}
            component={() => (
              <EnrolledOfferContainer
                openProviderUpdateModal={openProviderUpdateModal}
                role={role}
                providerId={myProviderId}
              />
            )}
          />
          <Route
            path={`${basePath}/pathways`}
            component={() => (
              <PathwayContainer
                openProviderUpdateModal={openProviderUpdateModal}
                role={role}
                providerId={myProviderId}
              />
            )}
          />
        </div>
      </Layout>
      {role === 'provider' && (
        <>
          <ProviderUpdateContainer
            provider_id={myProviderId}
            visible={modalStates.providerUpdateModal}
            onCancel={() =>
              setModalStates({
                providerUpdateModal: false,
                providerSimpleUpdateModal: false,
              })
            }
          />
          <ProviderSimpleUpdateContainer
            provider_id={myProviderId}
            visible={modalStates.providerSimpleUpdateModal}
            onCancel={() =>
              setModalStates({
                ...modalStates,
                providerSimpleUpdateModal: false,
              })
            }
          />
        </>
      )}
    </>
  );
}

const DashboardScreenWithRouter = withRouter(DashboardScreen);

export default function (props) {
  return (
    <DataFieldStore.Provider>
      <ProviderStore.Provider>
        <OfferStore.Provider>
          <PathwayStore.Provider>
            <EnrollmentStore.Provider>
              <DashboardScreenWithRouter {...props} />
            </EnrollmentStore.Provider>
          </PathwayStore.Provider>
        </OfferStore.Provider>
      </ProviderStore.Provider>
    </DataFieldStore.Provider>
  );
}
