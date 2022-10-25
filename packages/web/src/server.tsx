import 'cross-fetch/polyfill';
import express, { Response } from 'express';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { StaticRouter } from 'react-router-dom/server';
import { GetObjectCommand, NoSuchKey } from '@aws-sdk/client-s3';
// TODO: fix import from different monorepo package
import { getS3Client } from '../../shared/src/utils/aws';
import { getPort, getClientVars, isStaging, getAwsS3Bucket } from '../../shared/src/utils/env';
import { initRollbarLogger, logger } from '../../shared/src/utils/logger';
import { AppStore, createApplicationStore } from './store';
import { App } from './components/App';
import path from 'path';
import { readFile } from 'fs/promises';
import { Layout } from 'components/Layout';
import { createSettleAsyncActionsMiddleware } from './store/middlewares/settleAsyncActions';
import { setTimeout } from 'timers/promises';
import { Readable } from 'stream';

initRollbarLogger();

const app = express();

const publicStaticDir = '/static';
const staticAbsolutePath = path.join(__dirname, 'static');
const robotsTxt = isStaging() ? '/robots.staging.txt' : '/robots.txt';

const robotsTxtPromise = readFile(path.join(__dirname, robotsTxt));
const loadAssetsPromise = loadAssets();
const defaultSiteFaviconPromise = readFile(path.join(staticAbsolutePath, 'default-favicon.png'));

app.use(publicStaticDir, express.static(staticAbsolutePath));

app.get('/robots.txt', (_, res) =>
  robotsTxtPromise
    .then((data) => res.send(data))
    .catch(() => {
      res.status(404);
      res.send();
    })
);

app.get('/sitemaps/*', async (req, res) => {
  const basename = path.basename(req.url);
  pipeS3Object(`sitemaps/${basename}`, res);
});

app.get('/favicons/*', async (req, res) => {
  const basename = path.basename(req.url);
  const fallback = await defaultSiteFaviconPromise;
  pipeS3Object(`favicons/${basename}`, res, fallback);
});

app.get('*', async (req, res, next) => {
  try {
    const { renderResult, store } = await renderCycle(req.url);
    const head = Helmet.renderStatic();
    const { js, css } = await loadAssetsPromise;

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
  } catch (e) {
    logger.error(e);
    next(e);
  }
});

app.listen(getPort(8080));

async function loadAssets() {
  const assets: { js: string[]; css: string[] } = { js: [], css: [] };

  try {
    const statsStr = await readFile(path.join(staticAbsolutePath, 'stats.json'));
    const stats = JSON.parse(statsStr.toString()).assetsByChunkName as Record<string, string[]>;

    return Object.values(stats)
      .flat()
      .reduce((acc, asset) => {
        if (asset.endsWith('.js')) {
          acc.js.push(path.join(publicStaticDir, asset));
        }

        if (asset.endsWith('.css')) {
          acc.css.push(path.join(publicStaticDir, asset));
        }

        return acc;
      }, assets);
  } catch (e) {
    logger.error('Unexpected assets error', e);
    throw e;
  }
}

async function pipeS3Object(objectKey: string, res: Response, fallback?: Buffer) {
  try {
    const s3client = getS3Client();
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
    if (fallback) {
      res.send(fallback);
    } else if (e instanceof NoSuchKey) {
      res.status(404).send();
    } else {
      logger.error('Unexpected S3 error', e);
      res.status(500).send();
    }
  }
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
