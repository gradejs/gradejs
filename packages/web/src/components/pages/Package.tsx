import React from 'react';
import { Error } from 'components/layouts';
import PackagePage from '../layouts/PackagePage/PackagePage';
import { useParams } from 'react-router-dom';
import { usePackageInfo } from '../../store/hooks/usePackageInfo';

export function PackageView() {
  const { '*': packageName } = useParams();
  if (!packageName) {
    return <Error host='' />; // TODO
  }

  const { packageInfo, isLoading, error } = usePackageInfo(packageName);

  if (packageName && !isLoading && error) {
    // TODO: 404 error page
    return <Error host={packageName} message='Package is not found in the database' />;
  }

  return <PackagePage loading={isLoading} packageInfo={packageInfo} />;
}
