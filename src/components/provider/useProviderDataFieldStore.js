import DataFieldStore from 'store/DataField';
import ProviderStore from 'store/Provider';

export default function useProviderDataFieldStore() {
    const datafieldStore = DataFieldStore.useContainer();
    const providerStore = ProviderStore.useContainer();

    return {
        datafield: {
            ...datafieldStore,
        },
        provider: {
            ...providerStore
        }
    };
}
