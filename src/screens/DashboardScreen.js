import React, { useState, useEffect } from 'react';
import AuthService from 'services/AuthService';
import { withRouter, Redirect } from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import { Layout } from 'antd';
import axiosInstance from 'services/AxiosInstance';
import { GlobalProvider } from 'store/GlobalStore';
import Sidebar from 'components/Sidebar';
import PrivateRoute from 'services/PrivateRoute';
import 'assets/scss/antd-overrides.scss';

const ProviderContainer = imported(() =>
  import('components/provider/ProviderContainer')
);

const ProviderSimpleUpdateContainer = imported(() =>
  import('components/provider/ProviderSimpleUpdateContainer')
);

const ProviderUpdateContainer = imported(() =>
  import('components/provider/ProviderUpdateContainer')
);

const OfferContainer = imported(() =>
  import('components/offer/OfferContainer')
);

const EnrollmentContainer = imported(() =>
  import('components/enrollment/EnrollmentContainer')
);

const PathwayContainer = imported(() =>
  import('components/pathway/PathwayContainer')
);

const DataFieldContainer = imported(() =>
  import('components/datafield/DataFieldContainer')
);

function DashboardScreen(props) {
  let { match } = props;
  const { url: basePath } = match;

  const myProviderId = AuthService.currentSession.provider_id;
  const role = AuthService.currentSession.role;

  const [modalStates, setModalStates] = useState({
    providerUpdateModal: false,
    providerSimpleUpdateModal: false,
  });

  useEffect(() => {
    if (role === 'provider') {
      // only check if login user is a provider
      getProviderInfo(myProviderId);
    }
  }, [myProviderId]);

  const openProviderUpdateModal = () => {
    setModalStates({
      providerUpdateModal: true,
      providerSimpleUpdateModal: false,
    });
  };

  async function getProviderInfo(providerId) {
    const { data } = await axiosInstance(`/providers/${providerId}`);
    if (data && !data.name) {
      const modalDelay = setTimeout(() => {
        setModalStates({ ...modalStates, providerSimpleUpdateModal: true });
      }, 150);
      return () => clearTimeout(modalDelay);
    }
  }

  return (
    <GlobalProvider>
      <Layout className="w-full flex flex-row bg-gray-300 min-h-full overflow-y-auto">
        <Sidebar {...props} role={role} />
        <div className="h-min-full w-full">
          <PrivateRoute
            exact
            path={role === 'admin' ? basePath : `${basePath}/:id`}
          >
            {role === 'admin' ? (
              <Redirect to={`${basePath}/providers`} />
            ) : (
              <Redirect to={`${basePath}/offers`} />
            )}
          </PrivateRoute>
          <PrivateRoute
            path={`${basePath}/providers`}
            restrictToRole="admin"
            role={role}
            component={() => (
              <ProviderContainer role={role} basePath={basePath} />
            )}
          />
          <PrivateRoute
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
          <PrivateRoute
            path={`${basePath}/enrollments`}
            component={() => (
              <EnrollmentContainer
                openProviderUpdateModal={openProviderUpdateModal}
                role={role}
                providerId={myProviderId}
              />
            )}
          />
          <PrivateRoute
            path={`${basePath}/pathways`}
            component={() => (
              <PathwayContainer
                openProviderUpdateModal={openProviderUpdateModal}
                role={role}
                providerId={myProviderId}
              />
            )}
          />
          <PrivateRoute
            path={`${basePath}/settings`}
            component={() => (
              <DataFieldContainer
                role={role}
                openProviderUpdateModal={openProviderUpdateModal}
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
    </GlobalProvider>
  );
}

export default withRouter(DashboardScreen);
