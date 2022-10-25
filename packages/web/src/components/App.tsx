import { getPublicRootUrl } from '../../../shared/src/utils/env';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { WebsiteResultsPage } from './pages/WebsiteResults';
import { PackageView } from './pages/Package';
type AppProps = {
  locationChangeHandler: (url?: string | URL) => void;
};
/**
 * The App component has not any router wrapper because it uses both with tests, storybook and browser.
 * Each environment should had a high order router component
 *
 * @example
 * <BrowserRouter>
 *   <App />
 * </BrowserRouter>
 */
export function App({ locationChangeHandler }: AppProps) {
  const location = useLocation();
  locationChangeHandler(location.pathname);
  return (
    <>
      <Helmet>
        <title>Production Webpack Bundle Analyzer - GradeJS</title>
        <meta
          name='description'
          content='GradeJS analyzes production JavaScript files and matches bundled NPM packages with specific version precision.'
        />

        <meta property='og:url' content={getPublicRootUrl() + location.pathname} />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Production Webpack Bundle Analyzer - GradeJS' />
        <meta
          property='og:description'
          content='GradeJS analyzes production JavaScript files and matches bundled NPM packages with specific version precision.'
        />
        <meta property='og:image' content='/static/sharing-image.png' />
      </Helmet>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='/scan/*' element={<WebsiteResultsPage />} />
        <Route path='/package/*' element={<PackageView />} />
        <Route path='*' element={<Navigate replace to='/' />} />
      </Routes>
    </>
  );
}
