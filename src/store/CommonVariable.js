// import React, { useState, useEffect } from 'react';
// const axios = require('axios').default;

// export const getNewGenericData = () => {
// const [values, setValues] = useState([])
// const getPdfData = async () => {
//     let pdfData = await axios.get(`http://localhost:8888/api/v1/offers?scope=with_details`)
//     return pdfData
// }
// useEffect(() => {
//     getPdfData().then(resp => {
//         if(resp.data.status == 200){
//             const filterdata =  resp.data.data.filter(item => item.is_generic === "true")
//             setValues(filterdata)
//         }
//     })
// },[])
// }
