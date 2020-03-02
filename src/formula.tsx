import React, { Component, FunctionComponent, useState } from 'react';
import { Input } from 'antd';

import './formula.less';

const { TextArea } = Input;

const MyComponent: FunctionComponent = (): JSX.Element => {

  const [formula, setFormula] = useState<string>("");

  return (

    <div className="formula-editor-container">

      <TextArea value={formula} placeholder="请输入公式" onChange={(e) => {
        setFormula(e.target.value)
      }} />

    </div>

  );
};

export default MyComponent;
