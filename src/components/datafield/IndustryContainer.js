import React, { useEffect ,useState} from 'react';
import axiosInstance from 'services/AxiosInstance';
import DataFieldTable from 'components/shared/DataFieldTable';
import  { configure } from 'axios-hooks';
import {  toast } from 'react-toastify';
import { Card } from 'antd';
const axios = require('axios').default;

configure({
  axios: axiosInstance,
});
toast.configure()
export  const getindustryData = async () => {
  // let token = JSON.parse(localStorage.getItem("currentSession"))
  // let user_id = token.id
  // let user_role = token.role
  // console.log("insssssss",user_role,user_id)
  let Data = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/get_industry`)
  return Data
}


export default function IndustryContainer(props) {
  // const history = useHistory();
 

  const [industryValues, setIndustryValues] = useState({
    name :""
  })
  const [getdata,setGetData] = useState()
  const postData = async (industryValues) => {
    let token = JSON.parse(localStorage.getItem("currentSession"))
    let name  = industryValues.name
    let user_id = token.id
    let user_role = token.role
    // console.log("insssssss",name,user_role,user_id)
    let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/add_industry`,{
      name,
      user_id,
      user_role
    })
    return pdfData
  }


  const handleName = (input) => {
    let inputValues = {...industryValues, name : input.target.value}
    // console.log("----------",inputValues)
    setIndustryValues(inputValues)
  }

  const handleButton =() => {
    postData(industryValues).then(resp => {
      // console.log(resp,"response")
      if(resp.status == 200){
        getindustryData().then(resp => {
          setGetData(resp.data.data)
        })
        setIndustryValues({name:""})
        notify("success")
      }
    }).catch(error => {
      console.log(error,"error")
    })
  }

  const notify = msg => {
    if (msg == "error") {
        toast.error("Please send the valid params")
    } else if (msg == "success") {
        toast.success("Data Save Successfully")
    } else if(msg == "netork"){
      toast.network("Network error Please check again")
    }
}

  useEffect(() => {
    getindustryData().then(resp => {
      // console.log(resp,"reeeeeeeeeeeee")
      if(resp.status == 200){
        setGetData(resp.data.data)
      }
    }).catch(error => {
      console.log(error,"errrrrrrrrrrrr")
    })
  }, []);
//  console.log("accedrationValues",industryValues)
  return (
    <>
    <Card title="Industry" className="shadow-md rounded-md">
    <input className="acc_input" id="create-course-form" onChange={(e) => handleName(e, "name")} value={industryValues?.name}></input>
    <button className="plus-icon ant-btn flex justify-center items-center ant-btn-primary ant-btn-circle ant-btn-sm" onClick={() => handleButton()}>
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" className="svg-inline--fa fa-plus fa-w-14 text-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
    </button>
    <DataFieldTable
        data={getdata}
        store={getdata}
        type="name"
        rules={[
          {
            required: true,
            message: 'Please enter a  name',
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            className: 'antd-col name_block',
          },
          {
            title: 'add',
          }
        ]
      }
      />
    </Card> 
    </>
  );
}
