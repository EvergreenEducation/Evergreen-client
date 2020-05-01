import React from 'react';
import './title-divider.scss';

function TitleDivider({
  title,
  align = 'normal',
  className,
  classNames = {
    leftContainer: '',
    middleSpan: '',
    rightContainer: '',
  },
  styles = {
    leftContainer: {},
    middleSpan: {},
    rightContainer: {},
  },
  style,
}) {
  return (
    <div
      className={`flex items-center w-full line-title ${className || ''}`}
      style={style}
    >
      <div
        className={classNames.leftContainer || ''}
        style={{
          ...styles.leftContainer,
          width: align === 'center' ? '50%' : null,
        }}
      />
      <span className={classNames.middleSpan} style={{ ...styles.middleSpan }}>
        {title}
      </span>
      <div
        className={classNames.rightContainer || ''}
        style={{
          ...styles.rightContainer,
          width: align === 'center' ? '50%' : null,
        }}
      />
    </div>
  );
}

export default TitleDivider;
