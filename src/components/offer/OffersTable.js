import React, { useEffect } from 'react';
import { Table, Button, Tag } from 'antd';
import dayjs from 'dayjs';
import 'scss/antd-overrides.scss';

const { Column } = Table;

function OffersTable(props) {
	const { data, providers, datafields, handleUpdateModal } = props;
	
	useEffect(() => {}, [data]);

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
				title="Category"
				dataIndex="category"
				key="category"
				render={
                    id => {
                        if (!datafields[id]) {
                            return null;
                        }
                        return datafields[id].name;
                    }
                }
			/>
            <Column
				className="antd-col"
				title="Provider"
				dataIndex="provider_id"
				key="provider_id"
				render={
                    id => {
                        if (providers[id]) {
                            return providers[id].name;
                        }
                        return null;
                    }
                }
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
                                }) || null
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
				title="Start Date"
				dataIndex="start_date"
				key="start_date"
				render={
                    date => {
                        return dayjs(date).format('MMM DD, YYYY');
                    }
                }
			/>
            <Column
				className="antd-col"
				title=""
				key="update"
				render={(text, record) => {
					return {
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
				}}}
			/>
        </Table>
    );
}

export default OffersTable;