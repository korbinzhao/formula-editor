import React, { FunctionComponent, useState, createRef, useEffect } from 'react';
import { Input, List } from 'antd';
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

/**
 * 将字符串传入另一个字符串固定位置
 * @param soure 被操作字符串
 * @param start 插入位置
 * @param newStr 被插入字符串片段
 */
function insertStr(soure, start, newStr): string {
  return soure.slice(0, start) + newStr + soure.slice(start);
}

/**
 * 将中文表达式转换为数学公式
 * @param expression 中文表达式
 */
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
  formula?: string; // 数学公式
  expression?: string; // 中文表达式
  onChange?: (expression, formula) => void; // 回调函数
}

let textareaDom: HTMLInputElement;

const Formula: FunctionComponent<Props> = (props: Props): JSX.Element => {

  const [expression, setExpression] = useState<string>(props.expression || '');

  // 当中文表达式发生变化
  const onExpressionChange = (expression) => {

    const formula = expression2formula(expression);

    props.onChange?.(expression, formula);

  }

  // 函数列表点击
  const onFunctionItemClick = (item) => {

    let addExpressionText = "";
    let cursorMove = false;

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

  // 字段列表点击
  const onFieldItemClick = (item) => {

    const preExpressionCursorPosition = textareaDom.selectionStart;

    const newExpression = insertStr(expression, preExpressionCursorPosition, `[${item.name}]`);

    setExpression(newExpression);

    textareaDom.focus();

    onExpressionChange(newExpression);
  }

  useEffect(() => {
    textareaDom = document.querySelector(`.${uniqueContainerClassName}`).querySelector('.expression-textarea');
    textareaDom.setSelectionRange(expression.length, expression.length);
  }, [props.expression]);

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
