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
    if (!state.isLoading && !state.isFailed && state.hostname) {
      navigate(`/w/${state.hostname}`, { replace: true });
    }
  });

  const handleDetectStart = useCallback(async (address: string) => {
    trackCustomEvent('HomePage', 'WebsiteSubmitted');
    // TODO: error state of input field, e.g. when empty
    if (!address.startsWith('http://') && !address.startsWith('https://')) {
      address = 'https://' + address;
    }
    await dispatch(parseWebsite(address));
  }, []);

  if (state.isFailed) {
    return <Error host={state.hostname} />;
  }

  return <Home onSubmit={handleDetectStart} loading={state.isLoading} />;
}
