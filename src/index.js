import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import memoryUntils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'
//用于记住登录状态 
//刷新页面或者关闭浏览器后重启依然保持登录状态
memoryUntils.user = storageUtils.getUser()
console.log('index')
ReactDOM.render(<App />,document.getElementById('root'));


