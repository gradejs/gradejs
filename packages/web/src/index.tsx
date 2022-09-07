import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import { App } from './components/App';
import { initAnalytics } from './services/analytics';
import 'styles/global.scss';

const locationChangeHandler = initAnalytics();

ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <App locationChangeHandler={locationChangeHandler} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);
