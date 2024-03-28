import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css'
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
