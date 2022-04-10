import React from 'react';
import ReactGTM from 'react-gtm-module';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from 'components/App';
import 'styles/font.scss';
import 'styles/global.scss';

if (process.env.GTM_ID) {
  ReactGTM.initialize({ gtmId: process.env.GTM_ID });
  (window as any).dataLayer.push({ event: 'event.enableAnalytics' }, { enableAnalytics: true });
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
);
