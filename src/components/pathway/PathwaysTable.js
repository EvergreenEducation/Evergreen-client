import React from 'react';
import { Table, Tag, Button } from 'antd';
import 'scss/antd-overrides.scss';

const { Column } = Table;

function PathwaysTable(props) {
    const { data, handleUpdateModal } = props;
    return (
        <Table
            dataSource={data}
            bordered
            className="ant-table-wrapper--responsive"
			rowClassName={() => "antd-row"}
			rowKey="id"
        >
			<Column
				className="antd-col"
				title="ID"
				dataIndex="id"
				key="id"
				render={(text, record) => ({
					children: text,
					props: {
						"data-title": "ID",
					}
				})}
			/>
            <Column
				className="antd-col"
				title="Name"
				dataIndex="name"
				key="name"
				render={(text, record) => ({
					children: text,
					props: {
						"data-title": "Name",
					}
				})}
			/>
            <Column
				className="antd-col"
				title="Generic Type"
				dataIndex="type"
				key="type"
				render={(text, record) => ({
					children: text,
					props: {
						"data-title": "Generic Type",
					}
				})}
			/>
            <Column
				className="antd-col"
				title="Offer Groups"
				dataIndex="groups_of_offers"
				key="groups_of_offers"
				render={(text, record) => {
                    let children = "N/A";

                    if (text && text.length) {
                        children = text;
                    }

                    return {
                        children: children,
                        props: {
                            "data-title": "Offer Groups",
                        }
                    }
                }}
			/>
            <Column
				className="antd-col"
				title="Topics"
				dataIndex="DataFields"
				key="DataFields"
				render={(datafields = [], record) => ({
					children: (
                        <>
                            {
                                datafields.map((datafield, index) => {
                                    if (datafield.type !== 'topic') {
                                        return null;
                                    }
                                    return (
                                        <Tag
                                            color={index % 2 ? "blue" : "orange"}
                                            key={index.toString()}
                                        >
                                            { datafield.name }
                                        </Tag>
                                    );
                                }) || "N/A"
                            }
                        </>
                    ),
					props: {
						"data-title": "Topics",
					}
				})}
			/>
            <Column
				className="antd-col"
				title=""
				key="update"
				render={(text, record) => ({
					children: (
                        <Button
                            type="link"
                            onClick={() => handleUpdateModal(record)}
                        >
                            Update
                        </Button>
                    ),
					props: {
						"data-title": "",
					}
				})}
			/>
        </Table>
    );
}

export default PathwaysTable;