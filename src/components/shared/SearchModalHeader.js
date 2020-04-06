import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import { Button, Row, Input } from 'antd';

const { Search } = Input;

export default function SearchModalHeader({ handleSearch, createHandler, title, buttonTitle }) {
  return (
    <Row className="items-center flex-no-wrap">
      <h2 className="mr-2">
          {title}
      </h2>
      <Search
        enterButton
        className="w-56 custom-search mr-2 rounded"
        onSearch={value => {
          handleSearch(value);
        }}
      />
      <Button
        className="rounded text-xs flex items-center"
        type="primary"
        size="small"
        onClick={createHandler}
      >
        <FontAwesomeIcon
          className="text-white mr-1 text-xs"
          icon={faPlusCircle}
        />
          {buttonTitle}
      </Button>
    </Row>
  )
}
