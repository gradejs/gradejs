import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../index';
import { requestWebPageScan } from '../slices/scans';
import { makeSelectScanResultByUrl } from '../selectors/websiteResults';

export const useScanResult = (scanUrl: string | undefined, pollWhilePending = false) => {
  const { displayUrl, normalizedUrl } = useMemo(() => {
    if (!scanUrl) {
      return {};
    }

    try {
      const prefixedScanUrl =
        !scanUrl.startsWith('http://') && !scanUrl.startsWith('https://')
          ? `https://${scanUrl}`
          : scanUrl;

      const parsedUrl = new URL(prefixedScanUrl);
      const shortenedUrl = `${parsedUrl.hostname}${parsedUrl.pathname}`;
      return {
        displayUrl: shortenedUrl.endsWith('/') ? shortenedUrl.slice(0, -1) : shortenedUrl,
        normalizedUrl: prefixedScanUrl,
      };
    } catch (_) {
      return {};
    }
  }, [scanUrl]);

  const dispatch = useAppDispatch();

  const scanResultSelector = useMemo(makeSelectScanResultByUrl, []);
  const scanResult = useAppSelector((state) => scanResultSelector(state, normalizedUrl));

  const requestScan = useCallback(async (requestedScanUrl) => {
    return dispatch(requestWebPageScan({ scanUrl: requestedScanUrl }));
  }, []);

  // Initial request if entity wasn't loaded
  useEffect(() => {
    if (normalizedUrl && !scanResult?.scan && !scanResult?.isLoading && !scanResult?.error) {
      requestScan(normalizedUrl);
    }
  }, [normalizedUrl, scanResult]);

  // Poll while scan is pending
  useEffect(() => {
    let timeoutId: number | undefined;
    if (
      pollWhilePending &&
      scanResult?.scan?.status === 'pending' &&
      !scanResult?.isLoading &&
      !scanResult?.error
    ) {
      timeoutId = window.setTimeout(() => {
        requestScan(normalizedUrl);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [pollWhilePending, normalizedUrl, scanResult]);

  return { normalizedUrl, displayUrl, scanResult, requestScan };
};
