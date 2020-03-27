import React from 'react';
import { Row, AutoComplete, Input } from 'antd';
import 'scss/antd-overrides.scss';
const { Search } = Input;

function SearchFunnel(props) {
    const { title } = props;
    return (
        <>
            <Row className="mb-2 items-center mt-2">
                <span
                    className="mr-2 text-gray-700 relative"
                    style={{ bottom: 2 }}
                >
                    {title}
                </span>
                <AutoComplete className="custom-search">
                    <Search
                        onSearch={value => console.log(value)}
                        enterButton
                    />
                </AutoComplete>
            </Row>
            <div
                className="rounded-sm h-32 bg-white"
                style={{
                    borderWidth: 1,
                    borderColor: "#d9d9d9"
                }}
            >

            </div>
        </>
    );
}

export default SearchFunnel;
