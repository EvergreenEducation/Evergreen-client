import React, { Component } from 'react';
import ProviderForm from 'components/ProviderForm';
import { Table } from 'antd';

const offerColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Offer Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Offer Description',
        dataIndex: 'description',
        key: 'description',
    }
];

const pathwayColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Pathways Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Pathways Description',
        dataIndex: 'description',
        key: 'description',
    }
];

class ProviderCreationScreen extends Component {
    constructor(props) {
        super(props);
        this.uploadRef = React.createRef();
        this.formRef = React.createRef();
    }

    getFormData = (results) => {
        const formData = this.formRef.current.getFieldsValue(["name"]);
        console.log(formData);

        const uploadData = this.uploadRef.current.state.file;
        console.log(uploadData);
    }

    render() {
        return (
            <>
                <ProviderForm
                    ref={{
                        formRef: this.formRef,
                        uploadRef: this.uploadRef
                    }}
                />
                <section className="mt-2">
                    <label className="mb-2 block">
                        Offers - Table
                    </label>
                    <Table
                        columns={offerColumns}
                        dataSource={[]}
                    />
                </section>
                <section className="mt-2">
                    <label className="mb-2 block">
                        Pathways -Table
                    </label>
                    <Table
                        columns={pathwayColumns}
                        dataSource={[]}
                    />
                </section>
            </>
        );
    }
}

export default ProviderCreationScreen;
