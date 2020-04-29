import React from 'react';
import './title-divider.scss';

function TitleDivider({
  title,
  align = 'normal',
  className,
  classNames = {
    leftDiv: '',
    middleSpan: '',
    rightDiv: '',
  },
  styles = {
    leftDiv: {},
    middleSpan: {},
    rightDiv: {},
  },
  style,
}) {
  return (
    <div
      className={`flex items-center w-full line-title ${className || ''}`}
      style={style}
    >
      <div
        className={classNames.leftDiv || ''}
        style={{
          ...styles.leftDiv,
          width: align === 'center' ? '50%' : null,
        }}
      />
      <span className={classNames.middleSpan} style={{ ...styles.middleSpan }}>
        {title}
      </span>
      <div
        className={classNames.rightDiv || ''}
        style={{
          ...styles.rightDiv,
          width: align === 'center' ? '50%' : null,
        }}
      />
    </div>
  );
}

export default TitleDivider;
