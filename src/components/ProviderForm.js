import React from 'react';
import { Layout, Form, Input } from 'antd';
import ImageUploadAndNameInputs from 'components/inputs/ImageUploadAndNameInputs';

const ProviderForm = React.forwardRef((props, ref) => {
    const { formRef, uploadRef } = ref;
    const [ form ] = Form.useForm();

    return (
        <Layout>
            <Form
                form={form}
                ref={formRef}
            >
                <ImageUploadAndNameInputs
                    ref={uploadRef}
                >
                    <Form.Item
                        label="Description"
                        name="description"
                        style={{ display: "inherit" }}
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0"
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </ImageUploadAndNameInputs>
            </Form>
        </Layout>
    );
});

export default ProviderForm;