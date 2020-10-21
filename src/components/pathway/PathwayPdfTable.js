import React from 'react';
import { Table, Tag, Button } from 'antd';
import { groupBy } from 'lodash';
import 'assets/scss/antd-overrides.scss';
import {
    CollapsibleComponent,
    CollapsibleHead,
    CollapsibleContent
  } from "react-collapsible-component";
const { Column } = Table;

function PathwaysPdfTable(props) {
    const { data} = props;
    // console.log("000000000", data)
    const handleLink =(text) => {
        window.open( 
          `${text.rubric_attachment}`, "_blank");
      }
    return (
        <>
        <div>
          <Button ref={data} />
          <CollapsibleComponent>
            <CollapsibleHead className="additionalClassForHead">
              PDF LISTING
                      </CollapsibleHead>
            <CollapsibleContent className="additionalClassForContent">
              <Table
                ref={data}
                // loading={loading}
                pagination={{ pageSize: 8 }}
                dataSource={data}
                bordered
                className="ant-table-wrapper--responsive"
                rowClassName={() => 'antd-row'}
                rowKey="id"
              >
                <Column
                  className="antd-col"
                  title="Pdf Listing"
                  dataIndex="rubric_attachment"
                  key="rubric_attachment"
                  render={(text, record) => ({
                    children: text,
                    props: {
                      'rubric_attachment': 'rubric_attachment',
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
                        dataIndex="rubric_attachment"
                        key="rubric_attachment"
                        render={(text, record) => ({
                          children: text,
                          props: {
                            'rubric_attachment': 'rubric_attachment',
                          },
                        })}
                       >click here</Button>
                    ),
                    props: {
                      'rubric_attachment': 'rubric_attachment',
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

export default PathwaysPdfTable;
