import { useAppDispatch, useAppSelector } from '../index';
import { requestPackageInfo } from '../slices/package';
import { selectPackageInfo } from '../selectors/packageInfo';
import { useUniversalEffect } from './useUniversalEffect';

export const usePackageInfo = (packageName: string) => {
  const dispatch = useAppDispatch();
  const info = useAppSelector(selectPackageInfo);

  useUniversalEffect(() => {
    if (
      (!info.packageInfo || info.packageInfo.name !== packageName) &&
      !info.isLoading &&
      !info.error
    ) {
      dispatch(requestPackageInfo({ packageName }));
    }
  }, [info, packageName]);

  return info;
};
