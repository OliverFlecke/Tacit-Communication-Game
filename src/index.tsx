import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

class App extends React.Component {
    public render() {
        return (
            <div>
                Tacit Communication Game!
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();