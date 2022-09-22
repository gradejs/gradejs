import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { Error as ErrorLayout, SearchResults } from 'components/layouts';
import { trackCustomEvent } from '../../services/analytics';
import { useAppSelector, websiteResultsSelectors as selectors } from '../../store';
import { useScanResult } from '../../store/hooks/useScanResult';

export function WebsiteResultsPage() {
  const { hostname } = useParams();

  const { normalizedUrl, scanResult } = useScanResult(hostname, true);

  const packagesFiltered = useAppSelector((state) =>
    selectors.packagesSortedAndFiltered(state, normalizedUrl)
  );

  const packagesStats = useAppSelector((state) => selectors.packagesStats(state, normalizedUrl));

  const { packageKeywordList, vulnerabilityCount } = useAppSelector((state) =>
    selectors.scanOverview(state, normalizedUrl)
  );

  const { isProtected, isPending, isLoading, isFailed, isInvalid } = useAppSelector((state) =>
    selectors.scanState(state, normalizedUrl)
  );

  if (isFailed) {
    return (
      <ErrorLayout
        message='An unexpected error occurred. Try visiting us later.'
        action='Would you like to try another URL or report an issue?'
        actionTitle='Try another URL'
        host={normalizedUrl ?? ''}
      />
    );
  }

  if (isProtected) {
    // TODO: move to tracking middleware?
    trackCustomEvent('HostnamePage', 'SiteProtected');
    return (
      <ErrorLayout
        message='The entered website appears to be protected by a third-party service, such as DDoS prevention, password protection or geolocation restrictions.'
        action='Would you like to try another URL or report an issue?'
        actionTitle='Try another URL'
        host={normalizedUrl ?? ''}
      />
    );
  }

  if (isInvalid) {
    // TODO: move to tracking middleware?
    trackCustomEvent('HostnamePage', 'SiteInvalid');
    return (
      <ErrorLayout
        message='It looks like the entered website is not built with Webpack.'
        action='Would you like to try another URL or report an issue?'
        actionTitle='Try another URL'
        host={normalizedUrl ?? ''}
      />
    );
  }

  const title = `List of NPM packages that are used on ${normalizedUrl} - GradeJS`;
  const description =
    `GradeJS has discovered ${packagesStats.total} NPM packages used on ${normalizedUrl}` +
    (packagesStats.vulnerable > 0 ? `, ${packagesStats.vulnerable} are vulnerable` : '') +
    (packagesStats.outdated > 0 ? `, ${packagesStats.outdated} are outdated` : '');

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
      </Helmet>
      <SearchResults
        isLoading={isLoading}
        isPending={isPending}
        vulnerabilities={scanResult?.scan?.scanResult?.vulnerabilities ?? {}}
        searchQuery={normalizedUrl ?? ''}
        packages={packagesFiltered ?? []}
        packagesStats={packagesStats}
        vulnerabilitiesCount={vulnerabilityCount}
        keywordsList={packageKeywordList}
        scanDate={scanResult?.scan?.finishedAt}
      />
    </>
  );
}
