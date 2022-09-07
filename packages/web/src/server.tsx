import express from 'express';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { StaticRouter } from 'react-router-dom/server';
// TODO: fix import from different monorepo package
import { getPort, getClientVars } from '../../shared/src/utils/env';
import { store } from './store';
import { App } from './components/App';
import path from 'path';
import { readFile } from 'fs';
import { Layout } from 'components/Layout';

const app = express();
const staticDir = '/static';

app.use(staticDir, express.static(path.join(__dirname, 'static')));
app.get('/robots.txt', (_, res) =>
  readFile(path.join(__dirname, '/robots.txt'), { encoding: 'utf-8' }, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      res.status(404);
      res.send(null);
    }
  })
);

function getScripts(statsStr: string) {
  let stats: Record<string, string[]>;
  const assets: { js: string[]; css: string[] } = { js: [], css: [] };
  try {
    stats = JSON.parse(statsStr).assetsByChunkName as Record<string, string[]>;
  } catch (e) {
    return assets;
  }

  return Object.values(stats)
    .flat()
    .reduce((acc, asset) => {
      if (asset.endsWith('.js')) {
        acc.js.push(staticDir + '/' + asset);
      }
      if (asset.endsWith('.css')) {
        acc.css.push(staticDir + '/' + asset);
      }
      return acc;
    }, assets);
}

app.get('*', (req, res) => {
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App locationChangeHandler={() => {}} />
      </StaticRouter>
    </Provider>
  );

  const helmet = Helmet.renderStatic();

  readFile(path.join(__dirname, 'static', 'stats.json'), { encoding: 'utf-8' }, (err, stats) => {
    if (err) {
      res.status(404).send();
      return;
    }

    const { js, css } = getScripts(stats);

    res.send(
      '<!doctype html>' +
        ReactDOMServer.renderToString(
          <Layout
            js={js}
            css={css}
            head={helmet}
            env={getClientVars()}
            initialState={store.getState()}
            html={html}
          />
        )
    );
  });
});

app.listen(getPort(8080));
