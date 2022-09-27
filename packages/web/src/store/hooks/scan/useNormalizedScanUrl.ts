import { useMemo } from 'react';

const errorState = {
  error: 'invalid.url',
  displayUrl: undefined,
  normalizedUrl: undefined,
  parsedUrl: undefined,
};

export const useNormalizedScanUrl = (scanUrl: string | undefined) =>
  useMemo(() => {
    if (!scanUrl) {
      return errorState;
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
        normalizedUrl: parsedUrl.toString(),
        parsedUrl,
      };
    } catch (_) {
      return errorState;
    }
  }, [scanUrl]);
