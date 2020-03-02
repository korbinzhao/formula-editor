import React, { Component, FunctionComponent, useState, createRef } from 'react';
import { Input, List, Typography } from 'antd';
import uuid from 'lodash-uuid';

import './formula.less';

const { TextArea } = Input;

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

const uniqueContainerClassName = `formula-${uuid()}`;

function insertStr(soure, start, newStr): string {
  return soure.slice(0, start) + newStr + soure.slice(start);
}

function expression2formula(expression) {

  let formula = expression;

  functions.forEach(item => {
    formula = formula.replace(new RegExp(item.name, 'g'), item.value);
  });

  fields.forEach(item => {
    formula = formula.replace(new RegExp(`\\[${item.name}\\]`, 'g'), `[${item.key}]`);
  })

  return formula;
}

interface Props{
  formula?: string;
  expression?: string;
  onChange?: (expression, formula) => void;
}

const Formula: FunctionComponent<Props> = (props: Props): JSX.Element => {

  const [expression, setExpression] = useState<string>(props.expression || '');

  const onExpressionChange = (expression) => {

    const formula = expression2formula(expression);

    props.onChange?.(expression, formula);

  }

  const onFunctionItemClick = (item) => {

    let addExpressionText = "";
    let cursorMove = false;
    const textareaDom: HTMLInputElement = document.querySelector(`.${uniqueContainerClassName}`).querySelector('.expression-textarea');

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
      }, 10)
    }

    onExpressionChange(newExpression);

  }

  const onFieldItemClick = (item) => {
    const textareaDom: HTMLInputElement = document.querySelector(`.${uniqueContainerClassName}`).querySelector('.expression-textarea');

    const preExpressionCursorPosition = textareaDom.selectionStart;

    const newExpression = insertStr(expression, preExpressionCursorPosition, `[${item.name}]`);

    setExpression(newExpression);

    textareaDom.focus();

    onExpressionChange(newExpression);
  }


  return (

    <div className={`formula-editor-container ${uniqueContainerClassName}`}>

      <TextArea className="expression-textarea"
        value={expression} placeholder="请输入公式" 
        onChange={(e) => {
          setExpression(e.target.value)
          onExpressionChange(e.target.value);
        }} />

      <div className="choice-container ">
        <List
          className="function-list"
          header={<div className="list-title">函数</div>}
          footer={<div></div>}
          bordered
          dataSource={functions}
          renderItem={item => (
            <List.Item key={item.key} onClick={() => { onFunctionItemClick(item) }}>
              <div className="operator-item choice-item">{item.name}</div>
            </List.Item>
          )}
        />
        <List
          className="field-list"
          header={<div className="list-title">字段</div>}
          footer={<div></div>}
          bordered
          dataSource={fields}
          renderItem={item => (
            <List.Item key={item.key} onClick={() => { onFieldItemClick(item) }}>
              <div className="field-item choice-item">{item.name}</div>
            </List.Item>
          )}
        />
      </div>

    </div>

  );
};

export default Formula;
