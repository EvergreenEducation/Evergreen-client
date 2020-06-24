import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Layout, Tooltip, Col } from 'antd';
import AuthService from 'services/AuthService';

const { Header } = Layout;

export default function LogOutTopbar({ children, renderNextToLogOut }) {
  return (
    <Header className="px-6 bg-white h-12 flex items-center">
      <Col span={17}>{children}</Col>
      <Col span={7} className="flex justify-end items-center">
        {renderNextToLogOut}
        <Button type="link" onClick={() => AuthService.logout()}>
          <Tooltip title="Sign out">
            <FontAwesomeIcon className="text-black" icon={faSignOutAlt} />
          </Tooltip>
        </Button>
      </Col>
    </Header>
  );
}
