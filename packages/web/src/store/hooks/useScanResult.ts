import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../index';
import { requestWebPageScan } from '../slices/scans';
import { makeSelectScanResultByUrl } from '../selectors/websiteResults';

export const useScanResult = (scanUrl: string | undefined, pollWhilePending = false) => {
  const { normalizedUrl, fullUrl } = useMemo(() => {
    if (!scanUrl) {
      return {};
    }

    try {
      const prefixedScanUrl =
        !scanUrl.startsWith('http://') && !scanUrl.startsWith('https://')
          ? `https://${scanUrl}`
          : scanUrl;

      const parsedUrl = new URL(prefixedScanUrl);
      return {
        normalizedUrl: `${parsedUrl.hostname}${parsedUrl.pathname}`,
        fullUrl: prefixedScanUrl,
      };
    } catch (_) {
      return {};
    }
  }, [scanUrl]);

  const dispatch = useAppDispatch();

  const scanResultSelector = useMemo(makeSelectScanResultByUrl, []);
  const scanResult = useAppSelector((state) => scanResultSelector(state, normalizedUrl));

  const requestScan = useCallback(async (requestedScanUrl) => {
    return dispatch(requestWebPageScan(requestedScanUrl));
  }, []);

  // Initial request if entity wasn't loaded
  useEffect(() => {
    if (fullUrl && !scanResult?.scan && !scanResult?.isLoading && !scanResult?.error) {
      requestScan(fullUrl);
    }
  }, [fullUrl, scanResult]);

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
        requestScan(fullUrl);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [pollWhilePending, fullUrl, scanResult]);

  return { normalizedUrl, scanResult, requestScan };
};
