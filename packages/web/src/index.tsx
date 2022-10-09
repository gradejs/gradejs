import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary, LEVEL_WARN } from '@rollbar/react';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import { App } from './components/App';
import { initAnalytics } from './services/analytics';
import 'styles/global.scss';
import { Env, getEnv, getProdEnv } from '@gradejs-public/shared';

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
          <App locationChangeHandler={locationChangeHandler} />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </RollbarProvider>,
  document.getElementById('app')
);
