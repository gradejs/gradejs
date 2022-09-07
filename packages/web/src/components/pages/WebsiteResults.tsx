import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Error as ErrorLayout, Website } from 'components/layouts';
import { trackCustomEvent } from '../../services/analytics';
import {
  useAppDispatch,
  useAppSelector,
  applyFilters,
  getWebsite,
  websiteResultsSelectors as selectors,
} from '../../store';
import { FiltersState } from '../layouts/Filters/Filters';

export function WebsiteResultsPage() {
  const { hostname } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { webpages, vulnerabilities } = useAppSelector(selectors.default);
  const packagesFiltered = useAppSelector(selectors.packagesSortedAndFiltered);
  const packagesStats = useAppSelector(selectors.packagesStats);
  const { isProtected, isPending, isLoading, isFailed, isInvalid } = useAppSelector(
    selectors.stateFlags
  );
  const setFilters = (filters: FiltersState) => dispatch(applyFilters(filters));

  // TODO: discuss. Looks ugly
  // Fetch data for SSR if host is already processed
  if (__isServer__ && hostname) {
    dispatch(getWebsite({ hostname, useRetry: false }));
  }

  useEffect(() => {
    if (hostname && !isLoading && isPending) {
      const promise = dispatch(getWebsite({ hostname }));
      return function cleanup() {
        promise.abort();
      };
    }
    return () => {};
  }, [hostname]);

  // TODO: properly handle history/routing
  useEffect(() => {
    if (!hostname || isFailed) {
      navigate('/', { replace: true });
    }
  }, [hostname]);

  if (isProtected) {
    // TODO: move to tracking middleware?
    trackCustomEvent('HostnamePage', 'SiteProtected');
    return (
      <ErrorLayout
        message='The entered website appears to be protected by a third-party service, such as DDoS prevention, password protection or geolocation restrictions.'
        action='Would you like to try another URL or report an issue?'
        actionTitle='Try another URL'
        host={hostname ?? ''}
        onRetryClick={() => {
          trackCustomEvent('HostnamePage', 'ClickRetry_Protected');
          navigate('/', { replace: false });
        }}
        onReportClick={() => {
          trackCustomEvent('HostnamePage', 'ClickReport_Protected');
        }}
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
        host={hostname ?? ''}
        onRetryClick={() => {
          trackCustomEvent('HostnamePage', 'ClickRetry_Invalid');
          navigate('/', { replace: false });
        }}
        onReportClick={() => {
          trackCustomEvent('HostnamePage', 'ClickReport_Invalid');
        }}
      />
    );
  }

  const title = `List of NPM packages that are used on ${hostname} - GradeJS`;
  const description =
    `GradeJS has discovered ${packagesStats.total} NPM packages used on ${hostname}` +
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
      <Website
        isLoading={isLoading}
        isPending={isPending}
        webpages={webpages}
        packages={packagesFiltered}
        host={hostname ?? ''}
        vulnerabilities={vulnerabilities}
        onFiltersApply={setFilters}
      />
    </>
  );
}
