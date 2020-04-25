import React from 'react';
import { Row, Input } from 'antd';

const { Search } = Input;

export default function SearchHeader({ onSearch, title, children }) {
  return (
    <Row className="items-center flex-no-wrap">
      <h2 className="mr-2 whitespace-pre">{title}</h2>
      <Search
        className="w-auto custom-search rounded"
        enterButton
        allowClear
        onSearch={onSearch}
      />
      {children}
    </Row>
  );
}
