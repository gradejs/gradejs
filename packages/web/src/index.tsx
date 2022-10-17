import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary, LEVEL_WARN } from '@rollbar/react';
import { BrowserRouter } from 'react-router-dom';
import { createApplicationStore } from './store';
import { App } from './components/App';
import { initAnalytics } from './services/analytics';
import { Env, getEnv, getProdEnv } from '../../shared/src/utils/env';
import 'styles/global.scss';
import ScrollToTop from './utils/ScrollToTop';

const store = createApplicationStore([], window.__INITIAL_STATE__ ?? {});
const locationChangeHandler = initAnalytics();

const rollbarConfig = {
  accessToken: getEnv(Env.RollbarApiKey),
  environment: `frontend_${getProdEnv()}`,
};

ReactDOM.hydrate(
  <RollbarProvider config={rollbarConfig}>
    <ErrorBoundary level={LEVEL_WARN}>
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop>
            <App locationChangeHandler={locationChangeHandler} />
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </RollbarProvider>,
  document.getElementById('app')
);
