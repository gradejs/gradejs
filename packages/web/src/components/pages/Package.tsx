import React from 'react';
import { Error } from 'components/layouts';
import PackagePage from '../layouts/PackagePage/PackagePage';
import { useParams } from 'react-router-dom';
import { usePackageInfo } from '../../store/hooks/usePackageInfo';
import { Helmet } from 'react-helmet';

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

  const title = `Real world usage & stats of ${packageName} - GradeJS`;
  const description =
    `GradeJS has discovered ${packageInfo?.usage.length} websites using ${packageName}` +
    (packageInfo?.usage.length
      ? `: ${packageInfo?.usage.slice(0, 4).map((u) => u.hostname?.hostname)} and more.`
      : '');
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
      </Helmet>
      <PackagePage loading={isLoading} packageInfo={packageInfo} />
    </>
  );
}
