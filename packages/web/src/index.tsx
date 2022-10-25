import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary, LEVEL_WARN } from '@rollbar/react';
import { BrowserRouter } from 'react-router-dom';
import { createApplicationStore } from './store';
import { App } from './components/App';
import { initAnalytics } from './services/analytics';
import { Env, getProdEnv, getEnvUnsafe } from '../../shared/src/utils/env';
import 'styles/global.scss';
import ScrollToTop from './utils/ScrollToTop';

const store = createApplicationStore([], window.__INITIAL_STATE__ ?? {});
const locationChangeHandler = initAnalytics();
const accessToken = getEnvUnsafe(Env.RollbarApiKey);

let Wrapper: React.FC = ({ children }) => <>{children}</>;
if (accessToken) {
  Wrapper = ({ children }) => (
    <RollbarProvider
      config={{
        accessToken,
        environment: `frontend_${getProdEnv()}`,
      }}
    >
      <ErrorBoundary level={LEVEL_WARN}>{children}</ErrorBoundary>
    </RollbarProvider>
  );
}

ReactDOM.hydrate(
  <Wrapper>
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop>
          <App locationChangeHandler={locationChangeHandler} />
        </ScrollToTop>
      </BrowserRouter>
    </Provider>
  </Wrapper>,
  document.getElementById('app')
);
