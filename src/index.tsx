import React from 'react';
import ReactDOM from 'react-dom';
import Game from 'src/Game';
import registerServiceWorker from 'src/registerServiceWorker';

ReactDOM.render(<Game />, document.getElementById('root'));
registerServiceWorker();