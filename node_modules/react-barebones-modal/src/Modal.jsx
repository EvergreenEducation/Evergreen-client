import React from 'react'
import PropTypes from 'prop-types'
import './Modal.css'

const Modal = props => {
  const { autoHeight, children, show, top, customClassName, childClickHandler } = props

  const closeFunc = e => {
    if (e.target.className.indexOf('modalContainer') > -1) props.handleClose()
  }



  return (
    <div
      onClick={closeFunc}
      style={{ display: show ? 'block' : 'none' }}
      className='modalContainer'
    >
      <div
        onClick={childClickHandler}
        className={`${customClassName} ${
          autoHeight ? 'aHModalChild' : 'modalChild'
          } posr ${top ? `t${top}` : 't100'}`}
      >
        {children}
      </div>
    </div>
  )
}

Modal.defaultProps = {
  autoHeight: false,
  show: false,
  top: ''
}

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  customClassName: PropTypes.string,
  autoHeight: PropTypes.bool,
  show: PropTypes.bool,
  top: PropTypes.string
}

export default Modal