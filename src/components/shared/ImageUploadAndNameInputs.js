import React, { Component, useState, useEffect } from 'react';
import { Layout, Row, Col, Input, Form, Upload } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { imported } from 'react-imported-component/macro';
import 'scss/antd-overrides.scss';

const Skeleton = imported(() => import('antd/lib/skeleton'));

function getBase64(image, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(image);
}

function ImageUploadAndNameInputs(props) {
    const { children, onChangeUpload, file = {} } = props;
    const [ loading, setLoading ] = useState(false);
    const [ imageUrl, setImageUrl ] = useState(null);

    useEffect(() => {
        if (file) {
            console.log(file);
            // getBase64(file.originFileObj, imageUrl => {
            //     setImageUrl(imageUrl);
            //     setLoading(false);
            // });
        }
        // if (file && file.status === 'uploading') {
        //     setLoading(true);
        // }
        // if (file && file.status === 'done') {
        // }
    }, [file]);

    return (
        <Layout className="h-auto mb-6">
            <Row gutter={8}>
                <Col
                    span={7}
                    className="h-48"
                >
                    <Form.Item className="w-full h-full form-item-control-input-h-full-w-full">
                        <Upload
                            className="custom-ant-upload"
                            name="file"
                            listType="picture-card"
                            showUploadList={false}
                            onChange={onChangeUpload}
                        >
                            {
                                imageUrl
                                    ? <img
                                        src={imageUrl}
                                        alt="upload"
                                    /> 
                                    : (
                                        <div>
                                        {
                                            loading
                                                ? <Skeleton.Avatar
                                                    active={true}
                                                    avatar
                                                    shape="square"
                                                    style={{
                                                        width: "15rem",
                                                        height: "11rem"
                                                    }}
                                                />
                                                : <FontAwesomeIcon
                                                    className="text-black text-6xl"
                                                    icon={faCloudUploadAlt}
                                                />
                                        }
                                        </div>
                                    )
                            }
                        </Upload>
                    </Form.Item>
                </Col>
                <Col span={17}>
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