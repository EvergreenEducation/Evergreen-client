import React from 'react';
import { Table, Tag, Button } from 'antd';
import { groupBy } from 'lodash';
import 'scss/antd-overrides.scss';

const { Column } = Table;

function PathwaysTable(props) {
    const { data, handleUpdateModal, offers } = props;
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
				title="Provider"
				dataIndex="Provider"
				key="Provider.id"
				render={(provider, record) => {
					let children = 'N/A';
					if (provider) {
						children = provider.name;
					}
					return ({
						children,
						props: {
							"data-title": "Provider",
						}
					})
				}}
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
				dataIndex="GroupsOfOffers"
				key="index"
				render={(groups, record) => {
					let children = 'N/A';

					const grouped = groupBy(groups, 'group_name');
					const groupNames = Object.keys(grouped);

					if (groupNames.length) {
						children = (
							<>
								{
									groupNames.map((group_name, index) => {
										const count = grouped[group_name].length;
										return (
											<Tag
												color={index % 2 ? "cyan" : "green"}
												key={index.toString()}
											>
												{
													`${group_name} ( ${count} )`
												}
											</Tag>
										);
									}) || "N/A"
								}
							</>
						);
					}

                    return {
                        children,
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
				render={(datafields = [], record) => {
					let children = 'N/A';

					if (datafields.length) {
						children = (
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
						);
					}

					return {
						children,
						props: {
							"data-title": "Topics",
						}
					}
				}}
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
