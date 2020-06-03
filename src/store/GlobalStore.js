import React from 'react';
import DataFieldStore from 'store/DataField';
import ProviderStore from 'store/Provider';
import EnrollmentStore from 'store/Enrollment';
import OfferStore from 'store/Offer';
import PathwayStore from 'store/Pathway';
import StudentStore from 'store/Student';

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
    EnrollmentStore,
    StudentStore
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
    student: {
      ...StudentStore.useContainer(),
    },
  };
}
