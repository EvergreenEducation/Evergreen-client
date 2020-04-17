import React, { useEffect } from 'react';
import { Table, Popconfirm } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import EnrollmentStore from 'store/Enrollment';
import 'scss/antd-overrides.scss';

configure({
    axios: axiosInstance
})

const { Column } = Table;

export default function EnrollmentTable({
    selectedOffer
}) {
    const enrollmentStore = EnrollmentStore.useContainer();

    const [{
        data: enrollmentBody,
        error: enrollmentError,
    }] = useAxios(
      `/enrollments?offer_id=${selectedOffer.id}`
    );

    useEffect(() => {
        if (enrollmentBody) {
            enrollmentStore.addMany(enrollmentBody);
        }
    }, [selectedOffer, enrollmentBody]);
    
    const onCancel = e => {};

    const tableData = Object.values(enrollmentStore.entities).filter(e => {
        return e.offer_id === selectedOffer.id;
    });

    return (
        <Table
            dataSource={tableData}
            bordered
            className="ant-table-wrapper--responsive"
			rowClassName={() => "antd-row"}
			rowKey="id"
        >
            <Column
				className="antd-col"
				title="Student ID"
				dataIndex="student_id"
				key="student_id"
				render={(text, record) => ({
					children: text,
					props: {
						"data-title": "Student ID",
					}
				})}
			/>
            <Column
                className="antd-col"
                title="Activation Code"
                dataIndex="activation_code"
                key="activation_code"
                render={(text, record) => ({
                    children: text,
                    props: {
                        "data-title": "Activation Code",
                    }
                })}
            />
            <Column
				className="antd-col"
				title="Credit"
				dataIndex="credit"
				key="credit"
				render={(text, record) => ({
					children: text,
					props: {
						"data-title": "Credit",
					}
				})}
			/>
            <Column
				className="antd-col"
				title="Status"
				dataIndex="status"
				key="status"
				render={(text, record) => ({
					children: text,
					props: {
						"data-title": "Status",
					}
				})}
			/>
            <Column
                className="antd-col"
                title="Action"
                key="index"
                render={(text, record) => ({
                    children: (
                        <Popconfirm
                            className="cursor-pointer"
                            title="Do you want to give this student their credit?"
                            onConfirm={() => {}}
                            onCancel={onCancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            Approve
                        </Popconfirm>
                    ),
                    props: {
                        "data-title": "Action",
                    }
                })}
            />
        </Table>
    );
}
