import React from 'react';
import {Button, Row, Input} from 'antd';
const {Search} = Input;

export default function EnrollmentTopbar({
  title,
  activateCreditAssignment,
  setActivateCreditAssignment,
  // handleTableData={handleTableDataForSearch}
  handleSearch,
}) {
  return (
    <Row className="items-center flex-no-wrap">
      <h2 className="mr-2">{title}</h2>
      <Search
        enterButton
        className="w-56 custom-search mr-2 rounded"
        onSearch={value => {
          handleSearch(value);
        }}
      />
      <Button
        className="rounded"
        type="primary"
        size="small"
        onClick={() => setActivateCreditAssignment(!activateCreditAssignment)}
      >
        {activateCreditAssignment ? 'Lock Credit' : 'Assign Credit'}
      </Button>
    </Row>
  );
}
