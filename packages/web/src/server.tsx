import 'cross-fetch/polyfill';
import express, { Response } from 'express';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { StaticRouter } from 'react-router-dom/server';
import { S3Client, GetObjectCommand, NoSuchKey } from '@aws-sdk/client-s3';
// TODO: fix import from different monorepo package
import {
  getPort,
  getClientVars,
  isStaging,
  getAwsRegion,
  getAwsS3Bucket,
} from '../../shared/src/utils/env';
import { initRollbarLogger, logger } from '../../shared/src/utils/logger';
import { AppStore, createApplicationStore } from './store';
import { App } from './components/App';
import path from 'path';
import { readFile } from 'fs';
import { Layout } from 'components/Layout';
import { createSettleAsyncActionsMiddleware } from './store/middlewares/settleAsyncActions';
import { setTimeout } from 'timers/promises';
import { Readable } from 'stream';

const app = express();
const staticDir = '/static';

initRollbarLogger();

app.use(staticDir, express.static(path.join(__dirname, 'static')));

app.get('/robots.txt', (_, res) =>
  readFile(
    path.join(__dirname, isStaging() ? '/robots.staging.txt' : '/robots.txt'),
    { encoding: 'utf-8' },
    (err, data) => {
      if (!err) {
        res.send(data);
      } else {
        res.status(404);
        res.send();
      }
    }
  )
);

async function pipeS3Object(objectKey: string, res: Response) {
  try {
    const s3client = new S3Client({ region: getAwsRegion() });
    const s3command = new GetObjectCommand({
      Bucket: getAwsS3Bucket(),
      Key: objectKey,
    });

    const response = await s3client.send(s3command);

    if (response.Body instanceof Readable) {
      if (response.ContentType) {
        res.header('Content-Type', response.ContentType);
      }

      response.Body.pipe(res);
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (e) {
    if (e instanceof NoSuchKey) {
      res.status(404).send();
    } else {
      logger.error('Unexpected S3 error', e);
      res.status(500).send();
    }
  }
}

app.get('/sitemaps/*', async (req, res) => {
  const basename = path.basename(req.url);
  pipeS3Object(`sitemaps/${basename}`, res);
});

app.get('/favicons/*', async (req, res) => {
  const basename = path.basename(req.url);
  pipeS3Object(`favicons/${basename}`, res);
});

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

function renderPass(store: AppStore, location: string) {
  return ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={location}>
        <App locationChangeHandler={() => {}} />
      </StaticRouter>
    </Provider>
  );
}

async function renderTimeout(timeout: number, abort: AbortController) {
  await setTimeout(timeout, null, { signal: abort.signal });
  throw new Error('Timed out');
}

async function renderCycle(location: string, maxPasses = 3, passTimeout = 15000) {
  const { trackAsyncActionsMiddleware, settleAsyncActions } = createSettleAsyncActionsMiddleware();
  const store = createApplicationStore([trackAsyncActionsMiddleware]);

  let currentPass = 0;
  let renderResult = '';
  do {
    const timeoutAbortController = new AbortController();
    const renderTimeoutPromise = renderTimeout(passTimeout, timeoutAbortController);
    const renderPassResultPromise = settleAsyncActions(async () => renderPass(store, location));

    const passResult = await Promise.race([renderPassResultPromise, renderTimeoutPromise]);
    if (passResult) {
      timeoutAbortController.abort();
      renderResult = passResult.result;

      if (passResult.resolvedActionCount === 0) {
        break;
      }
    }

    currentPass++;
  } while (currentPass < maxPasses);

  return { renderResult, store };
}

app.get('*', async (req, res, next) => {
  try {
    const { renderResult, store } = await renderCycle(req.url);
    const head = Helmet.renderStatic();

    // TODO: Move this out to app initialization
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
              head={head}
              env={getClientVars()}
              html={renderResult}
              initialState={store.getState()}
            />
          )
      );
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

app.listen(getPort(8080));
