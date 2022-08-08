import React, { useCallback, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Error, Home } from 'components/layouts';
import { trackCustomEvent } from '../../services/analytics';
import { apiClientCtx } from '../../services/apiClient';

export default function HomePage() {
  const [isFailed, setFailed] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [hostname, setHostname] = useState('');
  const api = useContext(apiClientCtx);

  const handleDetectStart = useCallback(async (data: { address: string }) => {
    setLoading(true);
    trackCustomEvent('HomePage', 'WebsiteSubmitted');

    const host = new URL(data.address).hostname;

    try {
      await api.mutation('requestParseWebsite', data.address);
      setLoading(false);
      setHostname(host);
    } catch (e) {
      setFailed(host);
      setLoading(false);
    }
  }, []);

  if (hostname) {
    return <Navigate replace to={`/w/${hostname}`} />;
  }

  if (isFailed) {
    return (
      <Error
        host={isFailed}
        onReportClick={() => {
          trackCustomEvent('HomePage', 'ClickReport');
        }}
        onRetryClick={() => {
          trackCustomEvent('HomePage', 'ClickRetry');
          setFailed('');
        }}
      />
    );
  }

  return <Home onSubmit={handleDetectStart} isLoading={isLoading} />;
}
