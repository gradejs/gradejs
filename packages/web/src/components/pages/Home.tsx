import React, { useCallback, useEffect, useState } from 'react';
import { Error, Home } from 'components/layouts';
import { useNavigate } from 'react-router-dom';
import { useScanResult } from '../../store/hooks/useScanResult';
import { trackCustomEvent } from '../../services/analytics';

export function HomePage() {
  const navigate = useNavigate();
  const [requestedScanUrl, setRequestedScanUrl] = useState<string | undefined>(undefined);
  const { normalizedUrl, scanResult } = useScanResult(requestedScanUrl);

  useEffect(() => {
    if (scanResult && normalizedUrl && !scanResult.isLoading) {
      navigate(`/scan/${normalizedUrl}`);
    }
  }, [scanResult, normalizedUrl]);

  const handleScanRequest = useCallback(async (address: string) => {
    trackCustomEvent('HomePage', 'WebsiteSubmitted');
    setRequestedScanUrl(address);
  }, []);

  // TODO: This should be dropped in favour of error on result page
  if (normalizedUrl && scanResult?.error) {
    return <Error host={normalizedUrl} />;
  }

  return <Home onSubmit={handleScanRequest} loading={scanResult?.isLoading} />;
}
