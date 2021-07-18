import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import memoryUntils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'
memoryUntils.user = storageUtils.getUser()
ReactDOM.render(<App />,document.getElementById('root'));


