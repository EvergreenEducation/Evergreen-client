import React from 'react';
import DataFieldStore from 'store/DataField';
import ProviderStore from 'store/Provider';
import EnrollmentStore from 'store/Enrollment';
import OfferStore from 'store/Offer';
import PathwayStore from 'store/Pathway';

export function composeContainers(props, ...containers) {
  const { children } = props;
  return containers.reduceRight(
    (children, Container) => {
      return <Container.Provider>{children}</Container.Provider>;
    },
    [children]
  );
}

export function GlobalProvider(props) {
  return composeContainers(
    props,
    DataFieldStore,
    ProviderStore,
    OfferStore,
    PathwayStore,
    EnrollmentStore
  );
}

export default function useGlobalStore() {
  return {
    datafield: {
      ...DataFieldStore.useContainer(),
    },
    provider: {
      ...ProviderStore.useContainer(),
    },
    enrollment: {
      ...EnrollmentStore.useContainer(),
    },
    offer: {
      ...OfferStore.useContainer(),
    },
    pathway: {
      ...PathwayStore.useContainer(),
    },
  };
}
