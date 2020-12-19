"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactBarebonesModal = _interopRequireDefault(require("react-barebones-modal"));

var _reactUuid = _interopRequireDefault(require("react-uuid"));

var _propTypes = _interopRequireDefault(require("prop-types"));

require("./src/index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Slider = function Slider(_ref) {
  var _images = _ref.images,
      sliderMaxWidth = _ref.sliderMaxWidth;

  var _useState = (0, _react.useState)(_images || []),
      _useState2 = _slicedToArray(_useState, 2),
      images = _useState2[0],
      setImages = _useState2[1];

  var _useState3 = (0, _react.useState)(_images || []),
      _useState4 = _slicedToArray(_useState3, 2),
      modalImages = _useState4[0],
      setModalImages = _useState4[1];

  var _useState5 = (0, _react.useState)(0),
      _useState6 = _slicedToArray(_useState5, 2),
      currentIndex = _useState6[0],
      setCurrentIndex = _useState6[1];

  var _useState7 = (0, _react.useState)(0),
      _useState8 = _slicedToArray(_useState7, 2),
      translateValue = _useState8[0],
      setTranslateValue = _useState8[1];

  var _useState9 = (0, _react.useState)(0),
      _useState10 = _slicedToArray(_useState9, 2),
      currentIndexModal = _useState10[0],
      setCurrentIndexModal = _useState10[1];

  var _useState11 = (0, _react.useState)(0),
      _useState12 = _slicedToArray(_useState11, 2),
      translateValueModal = _useState12[0],
      setTranslateValueModal = _useState12[1];

  var _useState13 = (0, _react.useState)(false),
      _useState14 = _slicedToArray(_useState13, 2),
      showModal = _useState14[0],
      setShowModal = _useState14[1];

  var _useState15 = (0, _react.useState)(false),
      _useState16 = _slicedToArray(_useState15, 2),
      sliderWidth = _useState16[0],
      setSliderWidth = _useState16[1];

  if (showModal) document.body.style.overflow = "hidden";else document.body.style.overflow = "auto";
  (0, _react.useEffect)(function () {
    function handleClickOutside(e) {
      if (showModal && !e.target.closest("#modal-slider")) {
        alert("You clicked outside of me!");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return function () {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  var slideWidth = function slideWidth(isModal) {
    return document.querySelector(isModal ? '.modal-slide' : '.slide').clientWidth;
  };

  var _goToPrevSlide = function goToPrevSlide(reactClass, isModal) {
    var _currentIndex = isModal ? currentIndexModal : currentIndex;

    var _images = isModal ? modalImages : images;

    if (_currentIndex === 0) {
      if (isModal) {
        setCurrentIndexModal(_images.length - 1);
        setTranslateValueModal(-(slideWidth() * (_images.length - 1)));
      } else {
        setCurrentIndex(_images.length - 1);
        setTranslateValue(-(slideWidth() * (_images.length - 1)));
      }

      return;
    }

    if (isModal) {
      setCurrentIndexModal(currentIndexModal - 1);
      setTranslateValueModal(translateValueModal - 1 + slideWidth(true));
      setSliderWidth(slideWidth());
    } else {
      setCurrentIndex(currentIndex - 1);
      setTranslateValue(translateValue - 1 + slideWidth());
    }
  };

  var _goToNextSlide = function goToNextSlide(reactClass, isModal) {
    var _currentIndex = isModal ? currentIndexModal : currentIndex;

    var _images = isModal ? modalImages : images;

    if (_currentIndex === _images.length - 1) {
      if (isModal) {
        setCurrentIndexModal(0);
        setTranslateValueModal(0);
      } else {
        setCurrentIndex(0);
        setTranslateValue(0);
      }

      return;
    }

    if (isModal) {
      setCurrentIndexModal(currentIndexModal + 1);
      setTranslateValueModal(translateValueModal + -slideWidth(true));
      setSliderWidth(slideWidth());
    } else {
      setCurrentIndex(currentIndex + 1);
      setTranslateValue(translateValue + -slideWidth());
    }
  };

  var Slide = function Slide(_ref2) {
    var image = _ref2.image,
        index = _ref2.index,
        applyMinHeight = _ref2.applyMinHeight,
        isModal = _ref2.isModal;
    var styles = {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)'
    };

    if (isModal) {
      styles['maxWidth'] = '800px';
    } else if (!isModal && sliderMaxWidth) {
      styles['maxWidth'] = sliderMaxWidth;
    }

    if (applyMinHeight) styles['minHeight'] = '100%';
    return /*#__PURE__*/_react.default.createElement("div", {
      key: "slide-".concat((0, _reactUuid.default)()),
      className: isModal ? 'modal-slide' : 'slide',
      style: {
        width: '100%',
        position: 'relative'
      }
    }, /*#__PURE__*/_react.default.createElement("img", {
      className: isModal ? 'modal-slider-image' : 'slider-image',
      onClick: index > -1 ? function () {
        return handleImageClick(index);
      } : null,
      src: image,
      style: styles
    }));
  };

  var LeftArrow = function LeftArrow(props) {
    var classNames = "backArrow arrow";
    if (!props.isModal) classNames += " zi998";else classNames += " zi999";
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classNames,
      onClick: props.goToPrevSlide
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-arrow-left fa-2x",
      "aria-hidden": "true"
    }));
  };

  var RightArrow = function RightArrow(props) {
    var classNames = "nextArrow arrow";
    if (!props.isModal) classNames += " zi998";else classNames += " zi999";
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classNames,
      onClick: props.goToNextSlide
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-arrow-right fa-2x",
      "aria-hidden": "true"
    }));
  };

  var modalClickHandler = function modalClickHandler(e) {
    var allowList = ['arrow', 'fa-arrow-right', 'fa-arrow-left', 'modal-slider-image'];
    var foundClassNames = [];
    allowList.forEach(function (a) {
      var classNames = e.target.className.split(' ');
      var find = classNames.filter(function (c) {
        return c.indexOf(a) > -1;
      });
      if (find.length > 0) foundClassNames.push(a);
    });
    if (foundClassNames.length === 0) setShowModal(false);
  };

  var handleImageClick = function handleImageClick() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    setShowModal(true);
    setCurrentIndexModal(index);
    setTranslateValueModal(index * -800);
  };

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactBarebonesModal.default, {
    customClassName: "w80% mawa bgc-t t50 posa ofh",
    show: showModal,
    childClickHandler: modalClickHandler,
    handleClose: function handleClose() {
      return setShowModal(false);
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "modal-slider",
    className: "modal-slider",
    style: {
      width: "".concat(sliderWidth, "px"),
      display: showModal ? 'block' : 'none'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "slider-wrapper",
    style: {
      transform: "translateX(".concat(translateValueModal, "px)"),
      transition: 'transform ease-out 0.45s'
    }
  }, modalImages.map(function (image, i) {
    return /*#__PURE__*/_react.default.createElement(Slide, {
      applyMinHeight: true,
      key: "modal-".concat(i),
      image: image,
      isModal: true
    });
  })), /*#__PURE__*/_react.default.createElement(LeftArrow, {
    goToPrevSlide: function goToPrevSlide() {
      return _goToPrevSlide(null, true);
    },
    isModal: true
  }), /*#__PURE__*/_react.default.createElement(RightArrow, {
    goToNextSlide: function goToNextSlide() {
      return _goToNextSlide(null, true);
    },
    isModal: true
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "slider",
    style: {
      width: showModal ? "".concat(sliderWidth, "px") : '800px'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "slider-wrapper",
    style: {
      transform: "translateX(".concat(translateValue, "px)"),
      transition: 'transform ease-out 0.45s'
    }
  }, images.map(function (image, i) {
    return /*#__PURE__*/_react.default.createElement(Slide, {
      index: i,
      key: i,
      image: image
    });
  })), /*#__PURE__*/_react.default.createElement(LeftArrow, {
    goToPrevSlide: _goToPrevSlide
  }), /*#__PURE__*/_react.default.createElement(RightArrow, {
    goToNextSlide: _goToNextSlide
  })));
};

var _default = Slider;
exports.default = _default;
Slider.propTypes = {
  images: _propTypes.default.array.isRequired,
  sliderMaxWidth: _propTypes.default.string
};
