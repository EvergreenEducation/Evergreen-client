import React from 'react';
import { Row, Input } from 'antd';
import './search-header.scss';

const { Search } = Input;

export default function SearchHeader({
  onSearch,
  title,
  children,
  enterButton = true,
  onChange,
}) {
  return (
    <Row className="items-center flex-no-wrap search-header">
      <h2 className="mr-2 whitespace-pre search-header__title">{title}</h2>
      <Search
        className="w-auto rounded custom-search"
        enterButton={enterButton}
        allowClear
        onSearch={onSearch}
        onChange={onChange}
      />
      {children}
    </Row>
  );
}
