import React from 'react';
import ReactGA from 'react-ga';
import ReactDOM from 'react-dom';
import App from 'components/App';
import 'styles/font.scss';
import 'styles/global.scss';

if (process.env.GA_ID) {
  ReactGA.initialize(process.env.GA_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

ReactDOM.render(<App />, document.getElementById('app'));
