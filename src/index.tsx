import React from 'react';
import ReactDOM from 'react-dom';
import GameUI from './UI/GameUI';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<GameUI />, document.getElementById('root'));
registerServiceWorker();