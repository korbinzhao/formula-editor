import React, { Component, FunctionComponent, useState, createRef } from 'react';
import { Input, List, Typography } from 'antd';

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



const MyComponent: FunctionComponent = (): JSX.Element => {

  const formulaTextareaRef: React.LegacyRef<any> = createRef();

  const [formula, setFormula] = useState<string>("");

  const onFunctionItemClick = (item) => {

    let addText = "";

    switch (item.type) {
      case 'function':
        addText = item.value + "()"
        break;
      case 'operator':
        addText = item.value;
        break;
      default:
        break;

    }

    setFormula(formula + addText)

    formulaTextareaRef.current.focus();
    formulaTextareaRef.current.selectionStart = formula.length - 1;
  }

  const onFieldItemClick = (item) => {
    setFormula(formula + item.key)
  }

  return (

    <div className="formula-editor-container">

      <TextArea className="formula-textarea"
        ref={formulaTextareaRef}
        value={formula} placeholder="请输入公式" onChange={(e) => {
          setFormula(e.target.value)
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

export default MyComponent;
