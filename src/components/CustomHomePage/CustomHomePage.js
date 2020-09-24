import React, { useEffect, useState } from 'react';
// Ant design
import {
    Layout,
    Row,
    Col,
    Button,
    Popover,
    Input,
    Checkbox,
    Select,
    Switch,
} from 'antd';
// Axios
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
// Routing
import {
    Route,
    withRouter,
    useRouteMatch,
    useHistory,
    Link,
    Redirect,
} from 'react-router-dom';
// Component
import {CustomLocalPromoCarousel} from './CustomLocalPromoCarousel';
import {CustomMainPromoCarousel} from './CustomMainPromoCarousel';
import {CustomTopicCarousel} from './CustomTopicCarousel';



configure({
    axios: axiosInstance,
});

export default function CustomHomePage() {
    return(
    <div>
    </div>
    )
}