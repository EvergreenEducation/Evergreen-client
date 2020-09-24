import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import DataFieldTable from 'components/shared/DataFieldTable';
import useAxios, { configure } from 'axios-hooks';
import { ToastContainer, toast } from 'react-toastify';
import { Card } from 'antd';
const axios = require('axios').default;

configure({
    axios: axiosInstance,
});
toast.configure()
export const getData = async () => {
    let token = JSON.parse(localStorage.getItem("currentSession"))
    let user_id = token.id
    let user_role = token.role
    console.log("insssssss", user_role, user_id)
    let Data = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/files/get_page/${user_id}/${user_role}`)
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
        let httpAdd = "http://localhost:3000/"
        let page_route = httpAdd + pageValue.page_route
        let user_id = token.id
        let user_role = token.role
        console.log("insssssss", page_route, user_role, user_id)
        let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/add_page`, {
            page_route,
            user_id,
            user_role
        })
        return pdfData
    }


    const handleName = (input) => {
        let inputValues = { ...pageValue, page_route: input.target.value }
        console.log("----------", inputValues)
        setPageValue(inputValues)
    }

    const handleButton = () => {
        postData(pageValue).then(resp => {
            console.log(resp, "response")
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
            console.log(resp, "reeeeeeeeeeeee")
            if (resp.status == 200) {
                setGetData(resp.data.data)
            }
        }).catch(error => {
            console.log(error, "errrrrrrrrrrrr")
        })
    }, []);
    console.log("accedrationValues", pageValue)
    return (
        <>
            <Card title="Add Page" className="shadow-md rounded-md">
                <input className="acc_input" id="create-course-form" onChange={(e) => handleName(e, "page_route")} value={pageValue?.page_route} placeholder="Please enter route name"></input>
                <button className="plus-icon ant-btn flex justify-center items-center ant-btn-primary ant-btn-circle ant-btn-sm" onClick={() => handleButton()}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus fa-w-14 text-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
                </button>
                <DataFieldTable
                    data={getdata}
                    store={getdata}
                    type="Listing"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a topic name',
                        },
                        {
                            required: true,
                            message: '"Others" is already reserved. It cannot be used.',
                            pattern: new RegExp(/^(?!(Others)$).+$/gm),
                        },
                    ]}
                    onClick={() => handleButton()}
                    columns={[
                        {
                            title: 'Routes',
                            dataIndex: 'page_route',
                            key: 'page_route',
                            className: 'antd-col name_block',
                        },
                        {
                            title: 'Actions',
                        }
                    ]
                    }
                />
            </Card>
        </>
    );
}
