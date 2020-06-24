import React from 'react';
import { imported } from 'react-imported-component/macro';
import { Tooltip, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { LogOutTopbar } from 'components/shared';

const ProviderUpdateContainer = imported(() =>
  import('components/provider/ProviderUpdateContainer')
);

export default function ({ children, onClick, role = null }) {
  return (
    <LogOutTopbar
      renderNextToLogOut={
        role === 'provider' && (
          <Tooltip title="Update my information">
            <Button
              className="rounded mr-2 px-4"
              type="primary"
              size="small"
              onClick={onClick}
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
      {children}
    </LogOutTopbar>
  );
}
