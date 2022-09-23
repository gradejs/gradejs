import React, { useCallback, useEffect, useState } from 'react';
import { Error, Home } from 'components/layouts';
import { useNavigate } from 'react-router-dom';
import { useScanResult } from '../../store/hooks/useScanResult';
import { trackCustomEvent } from '../../services/analytics';

export function HomePage() {
  const navigate = useNavigate();
  const [requestedScanUrl, setRequestedScanUrl] = useState<string | undefined>(undefined);
  const { displayUrl, scanResult } = useScanResult(requestedScanUrl);

  useEffect(() => {
    if (scanResult && displayUrl && !scanResult.isLoading) {
      navigate(`/scan/${displayUrl}`);
    }
  }, [scanResult, displayUrl]);

  const handleScanRequest = useCallback(async (address: string) => {
    trackCustomEvent('HomePage', 'WebsiteSubmitted');
    setRequestedScanUrl(address);
  }, []);

  if (displayUrl && scanResult?.error) {
    return <Error host={displayUrl} />;
  }

  return <Home onSubmit={handleScanRequest} loading={scanResult?.isLoading} />;
}
