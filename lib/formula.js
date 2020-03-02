"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("antd/es/list/style");

var _list = _interopRequireDefault(require("antd/es/list"));

require("core-js/modules/es6.regexp.constructor");

require("core-js/modules/es6.regexp.replace");

require("antd/es/input/style");

var _input = _interopRequireDefault(require("antd/es/input"));

var _react = _interopRequireWildcard(require("react"));

var _lodashUuid = _interopRequireDefault(require("lodash-uuid"));

require("./formula.less");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const TextArea = _input.default.TextArea;
const functions = [{
  key: 'SUM',
  name: '总和',
  value: 'SUM',
  type: 'function'
}, {
  key: 'AVERAGE',
  name: '平均',
  value: 'AVERAGE',
  type: 'function'
}, {
  key: 'TOP',
  name: 'TOP',
  value: 'TOP',
  type: 'function'
}, {
  key: 'plus',
  name: '加',
  value: '+',
  type: 'operator'
}, {
  key: 'minus',
  name: '减',
  value: '-',
  type: 'operator'
}];
const fields = [{
  key: 'province',
  name: '省份',
  dataRole: 'DIMENSION'
}, {
  key: 'city',
  name: '城市',
  dataRole: 'DIMENSION'
}, {
  key: 'newConfirmed',
  name: '新增确诊',
  dataRole: 'MEASURE'
}, {
  key: 'totalConfirmed',
  name: '累计确诊',
  dataRole: 'MEASURE'
}, {
  key: 'newCoured',
  name: '新增治愈',
  dataRole: 'MEASURE'
}];
const uniqueContainerClassName = `formula-${(0, _lodashUuid.default)()}`;

function insertStr(soure, start, newStr) {
  return soure.slice(0, start) + newStr + soure.slice(start);
}

function expression2formula(expression) {
  let formula = expression;
  functions.forEach(item => {
    formula.replace(new RegExp(item.name, 'g'), item.value);
  });
  fields.forEach(item => {
    formula.replace(new RegExp(item.name, 'g'), item.key);
  });
  return formula;
}

const Formula = props => {
  const _useState = (0, _react.useState)(props.expression),
        _useState2 = _slicedToArray(_useState, 2),
        expression = _useState2[0],
        setExpression = _useState2[1];

  const _useState3 = (0, _react.useState)(props.formula),
        _useState4 = _slicedToArray(_useState3, 2),
        formula = _useState4[0],
        setFormula = _useState4[1];

  const onChange = () => {
    var _props$callback;

    console.log('--- onChange ---', expression, formula);
    (_props$callback = props.callback) === null || _props$callback === void 0 ? void 0 : _props$callback.call(props, expression, formula);
  };

  const onFunctionItemClick = item => {
    let addExpressionText = "";
    let cursorMove = false;
    const textareaDom = document.querySelector(`.${uniqueContainerClassName}`).querySelector('.expression-textarea');

    switch (item.type) {
      case 'function':
        addExpressionText = item.name + "()";
        cursorMove = true;
        break;

      case 'operator':
        addExpressionText = item.value;
        break;

      default:
        break;
    }

    const preExpressionCursorPosition = textareaDom.selectionStart;
    const newExpression = insertStr(expression, preExpressionCursorPosition, addExpressionText);
    setExpression(newExpression);
    const expressionCursorPosition = preExpressionCursorPosition + addExpressionText.length - 1;
    textareaDom.focus();

    if (cursorMove) {
      setTimeout(() => {
        textareaDom.setSelectionRange(expressionCursorPosition, expressionCursorPosition);
      }, 10);
    }

    onChange();
  };

  const onFieldItemClick = item => {
    const textareaDom = document.querySelector(`.${uniqueContainerClassName}`).querySelector('.expression-textarea');
    const preExpressionCursorPosition = textareaDom.selectionStart;
    const newExpression = insertStr(expression, preExpressionCursorPosition, `[${item.name}]`);
    setExpression(newExpression);
    textareaDom.focus();
    onChange();
  };

  return _react.default.createElement("div", {
    className: `formula-editor-container ${uniqueContainerClassName}`
  }, _react.default.createElement(TextArea, {
    className: "expression-textarea",
    value: expression,
    placeholder: "\u8BF7\u8F93\u5165\u516C\u5F0F",
    onChange: e => {
      setExpression(e.target.value);
    }
  }), _react.default.createElement("div", {
    className: "choice-container "
  }, _react.default.createElement(_list.default, {
    className: "function-list",
    header: _react.default.createElement("div", {
      className: "list-title"
    }, "\u51FD\u6570"),
    footer: _react.default.createElement("div", null),
    bordered: true,
    dataSource: functions,
    renderItem: item => _react.default.createElement(_list.default.Item, {
      key: item.key,
      onClick: () => {
        onFunctionItemClick(item);
      }
    }, _react.default.createElement("div", {
      className: "operator-item choice-item"
    }, item.name))
  }), _react.default.createElement(_list.default, {
    className: "field-list",
    header: _react.default.createElement("div", {
      className: "list-title"
    }, "\u5B57\u6BB5"),
    footer: _react.default.createElement("div", null),
    bordered: true,
    dataSource: fields,
    renderItem: item => _react.default.createElement(_list.default.Item, {
      key: item.key,
      onClick: () => {
        onFieldItemClick(item);
      }
    }, _react.default.createElement("div", {
      className: "field-item choice-item"
    }, item.name))
  })));
};

var _default = Formula;
exports.default = _default;