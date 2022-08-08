import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from 'components/App';
import 'styles/global.scss';
import { apiClientCtx, client } from 'services/apiClient';

ReactDOM.render(
  <apiClientCtx.Provider value={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </apiClientCtx.Provider>,
  document.getElementById('app')
);
