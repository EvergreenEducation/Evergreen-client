import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import { Button, Row, Input } from 'antd';

const { Search } = Input;

export default function ProviderHeader({ onSearch, createHandler }) {
  return (
    <Row className="items-center">
      <h2 className="mr-2">PROVIDERS</h2>
      <Search
        onSearch={value => console.log(value)}
        enterButton
        className="w-56 h-8 custom-search mr-2"
      />
      <Button
        type="primary"
        onClick={createHandler}
      >
        <FontAwesomeIcon
          className="text-white mr-1"
          icon={faPlusCircle}
        />
          PROVIDER
      </Button>
    </Row>
  )
}
