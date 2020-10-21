import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import DataFieldTable from 'components/shared/DataFieldTable';
import useAxios, { configure } from 'axios-hooks';
import { ToastContainer, toast } from 'react-toastify';
import { Card, Button, Table } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const axios = require('axios').default;
const { Column } = Table;

configure({
    axios: axiosInstance,
});
toast.configure()
export const getData = async () => {
    // let token = JSON.parse(localStorage.getItem("currentSession"))
    // let user_id = token.id
    // let user_role = token.role
    // console.log("insssssss", user_role, user_id)
    let Data = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/get_page`)
    return Data
}


export default function CreatePageContainer(props) {
    const history = useHistory();

    const [pageValue, setPageValue] = useState({
        page_route: ""
    })
    const [adddata, setAddData] = useState()
    const [getdata, setGetData] = useState()

    const postData = async (pageValue) => {
        let token = JSON.parse(localStorage.getItem("currentSession"))
        // console.log("wwwwwwwwww", process.env.REACT_APP_API_APIURL)
        let httpAdd = `${process.env.REACT_APP_API_APIURL}`
        let page_route = httpAdd + pageValue.page_route
        let user_id = token.id
        let user_role = token.role
        // console.log("insssssss", page_route, user_role, user_id)
        let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/add_page`, {
            page_route,
            user_id,
            user_role
        })
        return pdfData
    }

    const handleName = (event) => {
        let { value } = event.target;
        let inputValues = { ...pageValue, page_route: value.replace(/\s/g, '') }
        setPageValue(inputValues);
    }

    function matchDataFromUrl(pageValue) {
        if (getData) {
            for (let i = 0; i < getdata.length; i++) {
                let lastUrl = getdata[i].page_route.split('/');
                if (lastUrl[lastUrl.length - 1] === pageValue.page_route.trim()) {
                    return false
                }
            }
            return true
        } else {
            return true
        }
    }

    const handleButton = () => {
        let status = matchDataFromUrl(pageValue);
        if (status) {
            pageValue.page_route = pageValue.page_route;
            postData(pageValue).then(resp => {
                // console.log(resp, "response")
                if (resp.status == 200) {
                    setAddData(resp.data.data)
                    getData().then(resp => {
                        setGetData(resp.data.data)
                    })
                    setPageValue({ page_route: "" })
                    notify("success")
                }
            }).catch(error => {
                console.log(error, "error")
            })
        } else {
            toast.error("Custom route is already selected");
        }
    }

    const notify = msg => {
        if (msg == "error") {
            toast.error("Please send the valid params")
        } else if (msg == "success") {
            toast.success("Data Save Successfully")
        } else if (msg == "netork") {
            toast.network("Network error Please check again")
        }
    }

    useEffect(() => {
        getData().then(resp => {
            // console.log(resp, "reeeeeeeeeeeee")
            if (resp.status == 200) {
                setGetData(resp.data.data)
            }
        }).catch(error => {
            console.log(error, "errrrrrrrrrrrr")
        })
    }, []);

    const handleLink = (text) => {
        window.open(`${text.page_route}`, "_blank")
    }
    // console.log("accedrationValues", pageValue)
    return (
        <>
            <Card title="Add Page" className="shadow-md rounded-md">
                <input className="acc_input_listing" id="create-course-form" onChange={(e) => handleName(e, "page_route")} value={pageValue?.page_route} placeholder="Please enter route name"></input>
                <button disabled={pageValue.page_route === ""} className="plus-icon listing_aad_page ant-btn flex justify-center items-center ant-btn-primary ant-btn-circle ant-btn-sm" onClick={() => handleButton()}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus fa-w-14 text-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
                </button>
            </Card>
            <Table
                ref={getdata}
                // loading={loading}
                pagination={{ pageSize: 8 }}
                dataSource={getdata}
                bordered
                className="ant-table-wrapper--responsive"
                rowClassName={() => 'antd-row'}
                rowKey="id"
            >
                <Column
                    className="antd-col"
                    title="Listing"
                    dataIndex="page_route"
                    key="page_route"
                    render={(text, record) => ({
                        children: text,
                        props: {
                            'page_route': 'page_route',
                        },
                    })}
                />
                <Column
                    className="antd-col style-right"
                    // title="pdf_link"
                    key="page_route"
                    render={(text, record, index) => ({
                        children: (
                            <Button
                                onClick={() => handleLink(text)}
                                title="PDF Listing"
                                dataIndex="page_route"
                                key="page_route"
                                render={(text, record) => ({
                                    children: text,
                                    props: {
                                        'page_route': 'page_route',
                                    },
                                })}
                            >click here</Button>
                        ),
                        props: {
                            'page_route': 'page_route',
                        },
                    })}
                />
            </Table>
        </>
    );
}
