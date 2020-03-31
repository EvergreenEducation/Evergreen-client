import TypeStore from 'store/Type';
import ProviderStore from 'store/Provider';

export default function useProviderAndTypeStore() {
    const typeStore = TypeStore.useContainer();
    const providerStore = ProviderStore.useContainer();

    return {
        type: {
            ...typeStore,
        },
        provider: {
            ...providerStore
        }
    };
}
