import React from 'react';
import clsx from 'clsx';
import styles from './SearchResults.module.scss';
import Footer from 'components/ui/Footer/Footer';
import Container from 'components/ui/Container/Container';
import PackagePreview from '../../ui/PackagePreview/PackagePreview';
import SearchedResource from '../../ui/SearchedResource/SearchedResource';
import { Icon } from '../../ui/Icon/Icon';
import SearchResultsSidebar from 'components/ui/SearchResultsSidebar/SearchResultsSidebar';
import { SearchedResourceSkeleton } from '../../ui/SearchedResource/SearchedResourceSkeleton';
import { PackagePreviewSkeleton } from '../../ui/PackagePreview/PackagePreviewSkeleton';
import StickyDefaultHeader from '../../ui/Header/StickyDefaultHeader';
import { IdentifiedPackage } from '../../../types';
import SearchDesktopSorters from '../../ui/SearchDesktopSorters/SearchDesktopSorters';
import {
  PackageFilters,
  PackageSorters,
  PackageSortType,
} from '../../../store/slices/scanDisplayOptions';
import { getReadableSizeString, plural, repeat } from '../../../utils/helpers';
import { Button } from 'components/ui';
import ShowcaseContainer from 'components/containers/ShowcaseContainer';

type Props = {
  isLoading: boolean;
  faviconUrl?: string;
  scanUrl: string;
  packages: IdentifiedPackage[];
  packagesStats: { total: number; vulnerable: number; outdated: number };
  vulnerabilitiesCount: number;
  scriptsCount: number;
  bundleSize: number;
  availableFilters: PackageFilters;
  availableSorters: PackageSortType[];
  selectedFilters: PackageFilters;
  selectedSorters: PackageSorters;
  onFiltersChange: (newFilters: PackageFilters | null) => void;
  onFiltersReset: () => void;
  onSortChange: (newSorters: PackageSortType) => void;
  onRescanRequested?: () => void;
  scanDate?: string;
  webpackVersion?: string;
  accuracy: string;
};

export default function SearchResults({
  isLoading,
  faviconUrl,
  scanUrl,
  packages,
  packagesStats,
  vulnerabilitiesCount,
  scriptsCount,
  bundleSize,
  availableFilters,
  availableSorters,
  selectedFilters,
  selectedSorters,
  onFiltersChange,
  onFiltersReset,
  onSortChange,
  scanDate,
  webpackVersion,
  accuracy,
  onRescanRequested,
}: Props) {
  let webpackMeta;

  if (webpackVersion !== 'x.x') {
    webpackMeta = {
      icon: <Icon kind={'webpackLogo'} width={24} height={24} />,
      text: `Webpack v${webpackVersion}`,
    };
  } else {
    webpackMeta = {
      icon: <Icon kind={'webpackLogo'} width={24} height={24} />,
      text: `Unknown Webpack Version`,
    };
  }

  const metaItems = [
    webpackMeta,
    {
      icon: <Icon kind='weight' width={18} height={18} color='#212121' />,
      text: `${getReadableSizeString(bundleSize)} webpack bundle size`,
    },
    {
      icon: <Icon kind='search' width={16} height={16} color='#212121' />,
      text: plural(scriptsCount, 'script processed', 'scripts processed'),
    },
    {
      icon: (
        <Icon
          kind='vulnerability'
          width={18}
          height={17}
          color={packagesStats.vulnerable === 0 ? '#49D581' : '#F3512E'}
        />
      ),
      text:
        packagesStats.vulnerable === 0
          ? 'No vulnerabilities detected'
          : `${plural(packagesStats.vulnerable, 'package', 'packages')} with ${plural(
              vulnerabilitiesCount,
              'vulnerability',
              'vulnerabilities'
            )}`,
    },
    /*{
      icon: <Icon kind='duplicate' color='#F3812E' width={24} height={24} />,
      text: packagesStats.duplicate + ' duplicate packages',
    },*/
    {
      icon: <Icon kind='outdated' color='#F1CE61' stroke='white' width={18} height={18} />,
      text: plural(packagesStats.outdated, 'outdated package', 'outdated packages'),
    },
    {
      icon: <Icon kind='check' width={18} height={18} color='#212121' />,
      text: `~${accuracy}% estimated accuracy`,
    },
  ];

  return (
    <>
      <div
        key={scanUrl}
        className={clsx(styles.loadingBar, { [styles.loadingReady]: !isLoading })}
      />

      <StickyDefaultHeader showSearch searchQuery={scanUrl} />

      <Container>
        <div className={styles.searchResults}>
          <div className={styles.searchResultsResource}>
            {isLoading ? (
              <SearchedResourceSkeleton name={scanUrl} image={faviconUrl} />
            ) : (
              <SearchedResource
                image={faviconUrl}
                name={scanUrl}
                totalPackages={packagesStats.total}
                lastScanDate={scanDate}
                onRescanRequested={onRescanRequested}
              />
            )}

            {!isLoading && (
              <div className={styles.searchResultsSorters}>
                <SearchDesktopSorters
                  availableSorters={availableSorters}
                  selectedSorters={selectedSorters}
                  onSortChange={onSortChange}
                />
              </div>
            )}
          </div>

          <div className={styles.searchResultsSidebar}>
            <SearchResultsSidebar
              loading={isLoading}
              metaItems={metaItems}
              availableFilters={availableFilters}
              selectedFilters={selectedFilters}
              onFiltersChanged={onFiltersChange}
              onSortChange={onSortChange}
              availableSorters={availableSorters}
              selectedSorters={selectedSorters}
              onFiltersReset={onFiltersReset}
            />
          </div>

          {isLoading ? (
            <div className={styles.packages}>{repeat(5, <PackagePreviewSkeleton />)}</div>
          ) : packages.length > 0 ? (
            <div className={styles.packages}>
              {packages.map((pkg, index) => (
                <PackagePreview key={pkg.name} pkg={pkg} opened={index === 0} />
              ))}
            </div>
          ) : (
            <div className={styles.notFound}>
              <div className={styles.notFoundIcon}>
                <Icon kind='notFound' width={55} height={56} color='#4549FF' />
              </div>
              <h3 className={styles.notFoundTitle}>No matching packages</h3>
              <div className={styles.notFoundText}>
                Try softening the search terms or resetting the filter
              </div>
              <Button variant='secondary' size='small' onClick={onFiltersReset}>
                Reset filters
              </Button>
            </div>
          )}
        </div>

        <ShowcaseContainer showVulnerableWebsites={false} />
      </Container>

      <Footer />
    </>
  );
}
