import React, { useCallback, useEffect } from 'react';
import { Error, Home } from 'components/layouts';
import { trackCustomEvent } from '../../services/analytics';
import {
  useAppDispatch,
  parseWebsite,
  resetError,
  useAppSelector,
  homeDefaultSelector,
} from '../../store';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const state = useAppSelector(homeDefaultSelector);

  const handleDetectStart = useCallback(async (data: { address: string }) => {
    trackCustomEvent('HomePage', 'WebsiteSubmitted');
    await dispatch(parseWebsite(data.address));
  }, []);

  if (state.isFailed) {
    return (
      <Error
        host={state.hostname}
        onReportClick={() => {
          trackCustomEvent('HomePage', 'ClickReport');
        }}
        onRetryClick={() => {
          trackCustomEvent('HomePage', 'ClickRetry');
          dispatch(resetError());
        }}
      />
    );
  }

  // TODO: properly handle history/routing
  useEffect(() => {
    if (!state.isLoading && !state.isFailed && state.hostname) {
      navigate(`/w/${state.hostname}`, { replace: true });
    }
  });

  return (
    // TODO: pass proper props when API integration will take place
    <Home />
  );
}
