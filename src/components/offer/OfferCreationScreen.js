import React, { Component } from 'react';
import OfferForm from 'components/offer/OfferForm';
import { Table } from 'antd';

const pathwayColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Offer Name',
        dataIndex: 'name',
        key: 'name',
    }
];

class OfferCreationScreen extends Component {
    constructor(props) {
        super(props);
        this.uploadRef = React.createRef();
        this.formRef = React.createRef();
    }

    getFormData = (results) => {
        const formData = this.formRef.current.getFieldsValue(["name"]);

        const uploadData = this.uploadRef.current.state.file;
    }

    render() {
        return (
            <>
                <OfferForm />
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

export default OfferCreationScreen;
