import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WebsiteHostnamePage from './pages/WebsiteHostnamePage';
import { initAnalytics } from '../services/analytics';
const locationChangeHandler = initAnalytics();

/**
 * The App component has not any router wrapper because it uses both with tests, storybook and browser.
 * Each environment should had a high order router component
 *
 * @example
 * <BrowserRouter>
 *   <App />
 * </BrowserRouter>
 */
export default function App() {
  const location = useLocation();
  locationChangeHandler(location.pathname);
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path='/w/:hostname' element={<WebsiteHostnamePage />} />
      <Route path='*' element={<Navigate replace to='/' />} />
    </Routes>
  );
}
