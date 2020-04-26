import React from 'react';
import { Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

export default function ({
  classNames = {
    className: 'rounded text-xs flex items-center ml-2',
    fontAwesomeIcon: 'text-white mr-1 text-xs',
  },
  type = 'primary',
  size = 'small',
  onMouseEnter,
  onClick,
  text = null,
}) {
  return (
    <Button
      className={classNames.className}
      type={type}
      size={size}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <FontAwesomeIcon
        className={classNames.fontAwesomeIcon}
        icon={faPlusCircle}
      />
      {text}
    </Button>
  );
}
