import React, { useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Error, Home, Loading } from 'components/layouts';

const baseUrl = process.env.API_ORIGIN;

export default function HomePage() {
  const [isFailed, setFailed] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [hostname, setHostname] = useState('');

  const handleDetectStart = useCallback((data: { address: string }) => {
    setLoading(true);

    const host = new URL(data.address).hostname;

    fetch(`${baseUrl}/webpage`, {
      method: 'POST',
      body: JSON.stringify({ url: data.address }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then(() => {
        setLoading(false);
        setHostname(host);
      })
      .catch((e) => {
        console.error(e);
        setFailed(host);
        setLoading(false);
      });
  }, []);

  if (hostname) {
    return <Navigate replace to={`/w/${hostname}`} />;
  }
  if (isFailed) {
    return <Error host={isFailed} onRetry={() => setFailed('')} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return <Home onSubmit={handleDetectStart} />;
}
