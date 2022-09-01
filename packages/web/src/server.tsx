import express from 'express';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
// TODO: fix import from different monorepo package
import { getPort, getClientVars } from '../../shared/src/utils/env';
import { store } from './store';
import { App } from './components/App';
import path from 'path';
import { readFileSync } from 'fs';

const app = express();
const layout = readFileSync(path.resolve(__dirname, 'static', 'index.html'), { encoding: 'utf-8' });

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('*', (req, res) => {
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App locationChangeHandler={() => {}} />
      </StaticRouter>
    </Provider>
  );

  res.send(
    layout
      .replace('<div id="app"></div>', '<div id="app">' + html + '</div>')
      .replace('window.env = {};', 'window.env = ' + JSON.stringify(getClientVars()) + ';')
  );
});

app.listen(getPort(8080));
