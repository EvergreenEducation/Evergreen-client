import React, { Component } from 'react';
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

function handleBeforeUpload(file) {}

class ImageUploadAndNameInputs extends Component {
    state = {
        imageUrl: "",
        loading: false,
        file: {},
    };

    handleChange = (info) => {
        if (!info) {
            return;
        }
        const { status } = info.file;
        if (status === 'uploading') {
            this.setState({ loading: true })
        }

        if (status === 'done') {
            getBase64(info.file.originFileObj, imageUrl => {
                return this.setState({
                    imageUrl,
                    loading: false 
                });
            });
            this.setState({ loading: true, file: info.file });
        }
    }

    getFileData = () => this.state.file;

    render() {
        const { loading, imageUrl } = this.state;
        const uploadBtn = (
            <>
                {
                    loading
                        ? <Skeleton.Avatar
                            active={true}
                            avatar
                            shape={"square"}
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
            </>
        );
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
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={handleBeforeUpload}
                                // onChange={this.handleChange}
                            >
                                {
                                    imageUrl
                                        ? <img
                                            src={imageUrl}
                                            alt="upload"
                                        /> 
                                        : uploadBtn
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
                            <Input className="rounded" />
                        </Form.Item>
                        {this.props.children}
                    </Col>
                </Row>
            </Layout>
        );
    }
}

export default ImageUploadAndNameInputs;