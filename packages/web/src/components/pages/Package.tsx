import React from 'react';
import { Error } from 'components/layouts';
import PackagePage from '../layouts/PackagePage/PackagePage';
import { useParams } from 'react-router-dom';
import { usePackageInfo, usePackageUsage } from '../../store/hooks/usePackageInfo';
import { Helmet } from 'react-helmet';

export function PackageView() {
  const { '*': packageName } = useParams();
  if (!packageName) {
    return <Error host='' />; // TODO
  }

  const { packageInfo, isLoading, error } = usePackageInfo(packageName) ?? {};
  const { isUsageLoading, fetchMorePackageUsage } = usePackageUsage(packageName);

  if (packageName && !isLoading && (error || !packageInfo)) {
    // TODO: 404 error page
    return <Error host={packageName} message='Package is not found in the database' />;
  }

  const title = `Real world usage & stats of ${packageName} - GradeJS`;
  const description =
    `GradeJS has discovered ${packageInfo?.usageByHostnameCount} websites using ${packageName}` +
    (packageInfo?.usage.length
      ? `: ${packageInfo?.usage.slice(0, 4).map((u) => u.hostname)} and more.`
      : '');
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
      </Helmet>
      <PackagePage
        loading={isLoading}
        packageInfo={packageInfo}
        usageLoading={isUsageLoading}
        onUsageMoreClick={fetchMorePackageUsage}
      />
    </>
  );
}
