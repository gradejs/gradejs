import { useEffect, useMemo } from 'react';
import { useAppSelector } from '../../index';
import { makeSelectScanResultByUrl } from '../../selectors/websiteResults';
import { useNormalizedScanUrl } from './useNormalizedScanUrl';
import { useScanRequest } from './useScanRequest';
import { useUniversalEffect } from '../useUniversalEffect';

export const useScanResult = (
  scanUrl: string | undefined,
  { pollWhilePending = false, requestRescan = false } = {}
) => {
  const { displayUrl, normalizedUrl, parsedUrl } = useNormalizedScanUrl(scanUrl);

  const scanResultSelector = useMemo(makeSelectScanResultByUrl, []);
  const scanResult = useAppSelector((state) => scanResultSelector(state, normalizedUrl));

  const requestScan = useScanRequest();

  // Initial request if entity wasn't loaded
  useUniversalEffect(() => {
    if (normalizedUrl && !scanResult?.scan && !scanResult?.isLoading && !scanResult?.error) {
      requestScan(normalizedUrl, requestRescan);
    }
  }, [normalizedUrl, scanResult, requestRescan]);

  // Poll while scan is pending
  useEffect(() => {
    let timeoutId: number | undefined;
    if (
      pollWhilePending &&
      normalizedUrl &&
      scanResult?.scan?.status === 'pending' &&
      !scanResult?.isLoading &&
      !scanResult?.error
    ) {
      timeoutId = window.setTimeout(() => {
        requestScan(normalizedUrl);
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, [pollWhilePending, normalizedUrl, scanResult]);

  return { normalizedUrl, displayUrl, parsedUrl, scanResult };
};
