"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

require("./Modal.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Modal = function Modal(props) {
  var autoHeight = props.autoHeight,
      children = props.children,
      show = props.show,
      top = props.top,
      customClassName = props.customClassName,
      childClickHandler = props.childClickHandler;

  var closeFunc = function closeFunc(e) {
    if (e.target.className.indexOf('modalContainer') > -1) props.handleClose();
  };

  return /*#__PURE__*/_react["default"].createElement("div", {
    onClick: closeFunc,
    style: {
      display: show ? 'block' : 'none'
    },
    className: "modalContainer"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    onClick: childClickHandler,
    className: "".concat(customClassName, " ").concat(autoHeight ? 'aHModalChild' : 'modalChild', " posr ").concat(top ? "t".concat(top) : 't100')
  }, children));
};

Modal.defaultProps = {
  autoHeight: false,
  show: false,
  top: ''
};
Modal.propTypes = {
  children: _propTypes["default"].element.isRequired,
  customClassName: _propTypes["default"].string,
  autoHeight: _propTypes["default"].bool,
  show: _propTypes["default"].bool,
  top: _propTypes["default"].string
};
var _default = Modal;
exports["default"] = _default;
