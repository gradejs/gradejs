import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Error as ErrorLayout, SearchResults } from 'components/layouts';
import { trackCustomEvent } from '../../services/analytics';
import {
  useAppDispatch,
  useAppSelector,
  getScanResults,
  websiteResultsSelectors as selectors,
} from '../../store';

export function WebsiteResultsPage() {
  const { address } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /* TODO
     - Disable filters from selectors temporarity (done)
     - Pass all data from `packages` to PackagePreview, formalize Package type (done)
     - Connect filtering components, consider separate redux slice as a single source of truth about filters state
     - Make up filters types, reenable filters
     */

  const { vulnerabilities, keywordsList, status, vulnerabilitiesCount } = useAppSelector(
    selectors.default
  );
  const packagesFiltered = useAppSelector(selectors.packagesSortedAndFiltered);
  const packagesStats = useAppSelector(selectors.packagesStats);
  const { isProtected, isPending, isLoading, isFailed, isInvalid } = useAppSelector(
    selectors.stateFlags
  );

  // TODO: discuss. Looks ugly
  // Fetch data for SSR if host is already processed
  if (__isServer__ && address) {
    dispatch(getScanResults({ address, useRetry: false }));
  }

  useEffect(() => {
    if (address && isPending && !isFailed) {
      const promise = dispatch(getScanResults({ address }));
      return function cleanup() {
        promise.abort();
      };
    }
    return () => {};
  }, [address, isPending, isFailed]);

  // TODO: properly handle history/routing
  useEffect(() => {
    if (!address || isFailed) {
      navigate('/', { replace: true });
    }
  }, [address]);

  if (isProtected) {
    // TODO: move to tracking middleware?
    trackCustomEvent('HostnamePage', 'SiteProtected');
    return (
      <ErrorLayout
        message='The entered website appears to be protected by a third-party service, such as DDoS prevention, password protection or geolocation restrictions.'
        action='Would you like to try another URL or report an issue?'
        actionTitle='Try another URL'
        host={address ?? ''}
        /*
        onRetryClick={() => {
          trackCustomEvent('HostnamePage', 'ClickRetry_Protected');
          navigate('/', { replace: false });
        }}
        onReportClick={() => {
          trackCustomEvent('HostnamePage', 'ClickReport_Protected');
        }}
        */
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
        host={address ?? ''}
        /*
        onRetryClick={() => {
          trackCustomEvent('HostnamePage', 'ClickRetry_Invalid');
          navigate('/', { replace: false });
        }}
        onReportClick={() => {
          trackCustomEvent('HostnamePage', 'ClickReport_Invalid');
        }}
        */
      />
    );
  }

  const title = `List of NPM packages that are used on ${address} - GradeJS`;
  const description =
    `GradeJS has discovered ${packagesStats.total} NPM packages used on ${address}` +
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
        searchQuery={address ?? ''}
        packages={packagesFiltered}
        packagesStats={packagesStats}
        vulnerabilities={vulnerabilities ?? {}}
        vulnerabilitiesCount={vulnerabilitiesCount}
        keywordsList={keywordsList}
        status={status}
      />
    </>
  );
}
