import { useAppDispatch, useAppSelector } from '../index';
import { requestPackageInfo, requestPackageUsage } from '../slices/package';
import { makeSelectPackageInfo } from '../selectors/packageInfo';
import { useUniversalEffect } from './useUniversalEffect';
import { useCallback, useMemo } from 'react';

export const usePackageInfo = (packageName: string) => {
  const dispatch = useAppDispatch();
  const selectPackageInfo = useMemo(makeSelectPackageInfo, []);
  const info = useAppSelector((state) => selectPackageInfo(state, packageName));

  useUniversalEffect(() => {
    if (!info?.packageInfo && !info?.isLoading && !info?.error) {
      dispatch(requestPackageInfo({ packageName }));
    }
  }, [info, packageName]);

  return info;
};

export const USAGE_CHUNK_LIMIT = 16;

export const usePackageUsage = (packageName: string) => {
  const dispatch = useAppDispatch();
  const info = usePackageInfo(packageName);

  const fetchMorePackageUsage = useCallback(() => {
    if (info?.packageInfo) {
      dispatch(
        requestPackageUsage({
          packageName,
          limit: USAGE_CHUNK_LIMIT,
          offset: info.packageInfo.usage.length,
        })
      );
    }
  }, [info, packageName]);

  return {
    isUsageLoading: !!info?.isUsageLoading,
    fetchMorePackageUsage,
  };
};
