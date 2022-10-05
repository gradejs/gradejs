import { useCallback } from 'react';
import { requestWebPageScan } from '../../slices/scans';
import { useAppDispatch } from '../../index';

export const useScanRequest = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    async (normalizedUrl: string, requestRescan = false) => {
      if (!normalizedUrl) {
        return;
      }

      return dispatch(requestWebPageScan({ scanUrl: normalizedUrl, rescan: requestRescan }));
    },
    [dispatch]
  );
};
