import React from 'react';
import ProviderUpdateModal from 'components/provider/ProviderUpdateModal';
import DataFieldStore from 'store/DataField';

export default function ProviderUpdateContainer({ provider = {}, visible, onCancel }) {
    const datafieldStore = DataFieldStore.useContainer();
    return (
        <ProviderUpdateModal
            datafields={Object.values(datafieldStore.entities)}
            provider={provider}
            visible={visible}
            onCancel={onCancel}
        />
    );
};
