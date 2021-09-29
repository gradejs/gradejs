import React from 'react';
import TagManager from 'react-gtm-module';
import ReactDOM from 'react-dom';
import App from 'components/App';
import 'styles/font.scss';
import 'styles/global.scss';

if (process.env.GTM_ID) {
  TagManager.initialize({ gtmId: process.env.GTM_ID });
}

ReactDOM.render(<App />, document.getElementById('app'));
