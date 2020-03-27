import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBars, faDollarSign, faHandHoldingUsd,
    faTree, faRoute, faCog, faDatabase,
} from '@fortawesome/free-solid-svg-icons';

const { Sider } = Layout;

function Sidebar() {
    const [collapsed, setCollapse] = useState(true);

    const toggleSider = () => {
        setCollapse(!collapsed);
    }

    return (
        <Sider
            className="h-screen bg-green-500"
            trigger={null}
            collapsible
            collapsed={collapsed}
            >
            <div className="flex justify-center bg-green-600">
                <Button
                    className="mx-auto h-12 w-full"
                    type="link"
                    onClick={() => toggleSider()}
                >   
                    <FontAwesomeIcon
                        className="text-white"
                        icon={faBars}
                    />
                </Button>
            </div>
            <Menu
                className="bg-green-500"
                theme="dark"
                defaultSelectedKeys={['1']}
            >
                <Menu.Item
                    className="bg-green-500 text-center text-white bg-green-800-selected"
                    style={{ marginTop: 0, marginBottom: 0 }}
                    key="1"
                >
                    <Link to="/admin/providers">
                        <FontAwesomeIcon
                            className="text-white"
                            icon={faTree}
                        />
                        {
                            collapsed ? null : " Providers"
                        }
                    </Link>
                </Menu.Item>
                <Menu.Item
                    className="bg-green-500 text-center text-white bg-green-800-selected"
                    style={{ marginTop: 0, marginBottom: 0 }}
                    key="2"
                    disabled
                >
                    <Link to="/admin/offers">
                        <FontAwesomeIcon
                            className="text-white"
                            icon={faDollarSign}
                        />
                        {
                            collapsed ? null : " Offers"
                        }
                    </Link>
                </Menu.Item>
                <Menu.Item
                    className="bg-green-500 text-center text-white bg-green-800-selected"
                    style={{ marginTop: 0, marginBottom: 0 }}
                    key="3"
                    disabled
                >
                    <Link to="/admin/offers">
                        <FontAwesomeIcon
                            className="text-white"
                            icon={faHandHoldingUsd}
                        />
                        {
                            collapsed ? null : " Local offers"
                        }
                    </Link>
                </Menu.Item>
                <Menu.Item
                    className="bg-green-500 text-center text-white bg-green-800-selected"
                    style={{ marginTop: 0, marginBottom: 0 }}
                    key="4"
                    disabled
                >
                    <Link to="/admin/offers">
                        <FontAwesomeIcon
                            className="text-white"
                            icon={faRoute}
                        />
                        {
                            collapsed ? null : " Pathways"
                        }
                    </Link>
                </Menu.Item>
                <Menu.Item
                    className="bg-green-500 text-center text-white bg-green-800-selected"
                    style={{ marginTop: 0, marginBottom: 0 }}
                    key="5"
                >
                    <Link to="/admin/settings">
                        <FontAwesomeIcon
                            className="text-white"
                            icon={faCog}
                        />
                        {
                            collapsed ? null : " Settings"
                        }
                    </Link>
                </Menu.Item>
                <Menu.Item
                    className="bg-green-500 text-center text-white bg-green-800-selected"
                    style={{ marginTop: 0, marginBottom: 0 }}
                    key="6"
                    disabled
                >
                    <Link to="/admin/database">
                        <FontAwesomeIcon
                            className="text-white"
                            icon={faDatabase}
                        />
                        {
                            collapsed ? null : " Database"
                        }
                    </Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default Sidebar;