import React from 'react';
import { Button, Row } from 'antd';

export default function EnrollmentTopbar({
    title,
    activateCreditAssignment,
    setActivateCreditAssignment,
}) {
    return (
        <Row className="items-center flex-no-wrap">
            <h2 className="mr-2">
                {title}
            </h2>
            <Button
                className="rounded"
                type="default"
                onClick={() =>
                    setActivateCreditAssignment(!activateCreditAssignment)
                }
            >
                {activateCreditAssignment ? 'Lock Credit' : 'Assign Credit'}
            </Button>
        </Row>
    )
}
