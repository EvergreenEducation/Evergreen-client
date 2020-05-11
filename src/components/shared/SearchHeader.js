import React from 'react';
import { Row, Input } from 'antd';

const { Search } = Input;

export default function SearchHeader({
  onSearch,
  title,
  children,
  enterButton = true,
  onChange,
}) {
  return (
    <Row className="items-center flex-no-wrap">
      <h2 className="mr-2 whitespace-pre">{title}</h2>
      <Search
        className="w-auto custom-search rounded"
        enterButton={enterButton}
        allowClear
        onSearch={onSearch}
        onChange={onChange}
      />
      {children}
    </Row>
  );
}
