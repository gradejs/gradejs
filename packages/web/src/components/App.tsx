import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { WebsiteResultsPage } from './pages/WebsiteResults';
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
    <Routes>
      <Route index element={<HomePage />} />
      <Route path='/w/:hostname' element={<WebsiteResultsPage />} />
      <Route path='*' element={<Navigate replace to='/' />} />
    </Routes>
  );
}
