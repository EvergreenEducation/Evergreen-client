import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Input, Form, Upload, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import 'scss/antd-overrides.scss';

function getBase64(image, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    return reader.readAsDataURL(image);
}

function ImageUploadAndNameInputs(props) {
    const { children, onChangeUpload, file = null } = props;
    const [ imageUrl, setImageUrl ] = useState(null);
    useEffect(() => {
        if (file) {
            if (file.file_link) {
                setImageUrl(file.file_link);
                return;
            }
            getBase64(new Blob([file.originFileObj], { type: file.type }), imageUrl => {
                setImageUrl(imageUrl);
            });
        } else {
            setImageUrl(null);
        }
    }, [file]);

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
    }

    return (
        <Layout className="h-auto mb-6">
            <Row gutter={8}>
                <Col
                    span={5}
                    className="h-48"
                >
                    <Form.Item className="w-full h-full form-item-control-input-h-full-w-full justify-center flex">
                        <Upload
                            className="custom-ant-upload"
                            name="file"
                            listType="picture-card"
                            showUploadList={false}
                            onChange={onChangeUpload}
                            beforeUpload={beforeUpload}
                        >
                            {
                                imageUrl
                                    ? <img
                                        src={imageUrl}
                                        alt="upload"
                                    /> 
                                    : (
                                        <div>
                                            <FontAwesomeIcon
                                                className="text-black text-6xl"
                                                icon={faCloudUploadAlt}
                                            />
                                        </div>
                                    )
                            }
                        </Upload>
                    </Form.Item>
                </Col>
                <Col span={19}>
                    <Form.Item
                        label="Name"
                        name="name"
                        style={{ display: "inherit" }}
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0"
                        rules={[{ required: true, message: "Please enter a provider name" }]}
                    >
                        <Input className="rounded" name="name" />
                    </Form.Item>
                    {children}
                </Col>
            </Row>
        </Layout>
    );
}

export default ImageUploadAndNameInputs;