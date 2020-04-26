import React from 'react';
import { imported } from 'react-imported-component/macro';
import { Layout, Tooltip, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import {
  SelectOptionsContainer,
  OfferCategoryContainer,
  TopicContainer,
  ProviderTypeContainer,
} from 'components/datafield';
import { LogOutTopbar } from 'components/shared';

const { Content } = Layout;

const ProviderUpdateContainer = imported(() =>
  import('components/provider/ProviderUpdateContainer')
);

export default function ({ openProviderUpdateModal, role }) {
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
      />
      <Content className="p-6">
        <ProviderTypeContainer />
        <OfferCategoryContainer />
        <SelectOptionsContainer />
        <TopicContainer />
      </Content>
    </Layout>
  );
}
