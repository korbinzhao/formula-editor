import React, { Component } from "react";
import ReactDOM from "react-dom";
import Formula from '../src/index';

const expression = '平均(平均(TOP([城市])))+TOP([新增治愈])-[累计确诊]';

const App = () => {
  return (
    <div>
      <Formula expression={expression} onChange={(expression, formula) => {console.log(expression, formula)}} />
    </div>
  );
};

// export default App;

ReactDOM.render(<App />, document.getElementById("app"));
