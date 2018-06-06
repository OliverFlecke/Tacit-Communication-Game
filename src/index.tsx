import React from 'react';
import ReactDOM from 'react-dom';
import GameUI from 'src/UI/GameUI';
import registerServiceWorker from 'src/registerServiceWorker';

ReactDOM.render(<GameUI />, document.getElementById('root'));
registerServiceWorker();