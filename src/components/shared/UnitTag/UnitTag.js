import React from 'react';
import './unit-tag.scss';

export default function ({ number, unit }) {
  return (
    <div className="unit-tag mr-2 text-white rounded px-1">
      {Number(number) || null} {unit ? unit.name : null}
    </div>
  );
}
