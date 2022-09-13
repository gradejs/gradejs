import React, { useCallback, useEffect } from 'react';
import { Error, Home } from 'components/layouts';
import { trackCustomEvent } from '../../services/analytics';
import { useAppDispatch, parseWebsite, useAppSelector, homeDefaultSelector } from '../../store';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const state = useAppSelector(homeDefaultSelector);

  // TODO: properly handle history/routing
  useEffect(() => {
    if (!state.isLoading && !state.isFailed && state.address) {
      navigate(`/scan/${state.address}`);
    }
  });

  const handleDetectStart = useCallback(async (address: string) => {
    trackCustomEvent('HomePage', 'WebsiteSubmitted');
    // TODO: error state of input field, e.g. when empty
    await dispatch(parseWebsite(address));
  }, []);

  if (state.isFailed) {
    return (
      <Error
        host={state.address}
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

  return <Home onSubmit={handleDetectStart} loading={state.isLoading} />;
}
