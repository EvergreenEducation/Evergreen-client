import React, { useState,useEffect } from 'react';
import {
  CollapsibleComponent,
  CollapsibleHead,
  CollapsibleContent
} from "react-collapsible-component";
import { Table, Tag, Button } from 'antd';
import 'assets/scss/antd-overrides.scss';
const axios = require('axios').default;
const ref = React.createRef();
const { Column } = Table;

export const PdfListing = ({ data = [], loading, handleUpdateModal }) => {

  const [pdfValues, setPdfValues] = useState([])
  const getPdfData = async () => {
    let token = JSON.parse(localStorage.getItem("currentSession"))
    let user_id = token.id
    let user_role = token.role
    let pdfData = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/files/get_pdf_data/${user_id}/${user_role}`)
    return pdfData
  }

  useEffect(() => {
    getPdfData().then(resp => {
      console.log("resp", resp)
      if (resp.status == 200) {
        console.log("resp",resp)
        setPdfValues(resp.data.data)
      }
    }).catch(error => {
      console.log("error", error)
    })
  }, [])

  const handleLink =(text) => {
    window.open( 
      `${text.pdf_link}`, "_blank");
  }
  // console.log("pdfValues", pdfValues)
  return (
    <>
      <div>
        <Button ref={pdfValues} />
        <CollapsibleComponent>
          <CollapsibleHead className="additionalClassForHead">
            PDF LISTING
                    </CollapsibleHead>
          <CollapsibleContent className="additionalClassForContent">
            <Table
              ref={pdfValues}
              loading={loading}
              pagination={{ pageSize: 8 }}
              dataSource={pdfValues}
              bordered
              className="ant-table-wrapper--responsive"
              rowClassName={() => 'antd-row'}
              rowKey="id"
            >
              <Column
                className="antd-col"
                title="Pdf Listing"
                dataIndex="pdf_link"
                key="pdf_link"
                render={(text, record) => ({
                  children: text,
                  props: {
                    'pdf_link': 'pdf_link',
                  },
                })}
              />
              <Column
                className="antd-col"
                // title="pdf_link"
                key="pdf_link"
                render={(text, record,index) => ({
                  children: (
                    <Button
                      onClick={() => handleLink(text)}
                      title="PDF Listing"
                      dataIndex="pdf_link"
                      key="pdfValues"
                      render={(text, record) => ({
                        children: text,
                        props: {
                          'pdf_link': 'pdf_link',
                        },
                      })}
                     >click here</Button>
                  ),
                  props: {
                    'pdf_link': 'pdf_link',
                  },
                })}
              />
            </Table>
          </CollapsibleContent>
        </CollapsibleComponent>
      </div>
    </>
  );
}

export default PdfListing;
