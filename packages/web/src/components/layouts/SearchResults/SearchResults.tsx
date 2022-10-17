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
import { IdentifiedPackage } from 'store/selectors/websiteResults';
import { PackageFilters } from '../../../store/slices/scanDisplayOptions';
import { getReadableSizeString, plural } from '../../../utils/helpers';

type Props = {
  isLoading: boolean;
  isPending: boolean;
  scanUrl: string;
  packages: IdentifiedPackage[];
  packagesStats: { total: number; vulnerable: number; outdated: number };
  vulnerabilitiesCount: number;
  scriptsCount: number;
  bundleSize: number;
  availableFilters: PackageFilters;
  selectedFilters: PackageFilters;
  onFiltersChange: (newFilters: PackageFilters | null) => void;
  scanDate?: string;
  webpackVersion?: string;
  accuracy: string;
  // siteFavicon: string;
};

export default function SearchResults({
  isLoading,
  scanUrl,
  packages,
  packagesStats,
  vulnerabilitiesCount,
  scriptsCount,
  bundleSize,
  availableFilters,
  selectedFilters,
  onFiltersChange,
  scanDate,
  webpackVersion,
  accuracy,
}: Props) {
  const metaItems = [
    {
      icon: <Icon kind={'webpackLogo'} width={24} height={24} />,
      text: `Webpack v${webpackVersion}`,
    },
    {
      icon: <Icon kind='weight' width={24} height={24} color='#212121' />,
      text: `${getReadableSizeString(bundleSize)} webpack bundle size`,
    },
    {
      icon: <Icon kind='search' width={24} height={24} color='#212121' />,
      text: plural(scriptsCount, 'script processed', 'scripts processed'),
    },
    {
      icon: (
        <Icon
          kind='vulnerability'
          width={24}
          height={24}
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
      icon: <Icon kind='outdated' color='#F1CE61' stroke='white' width={24} height={24} />,
      text: plural(packagesStats.outdated, 'outdated package', 'outdated packages'),
    },
    {
      icon: <Icon kind={'check'} width={24} height={24} />,
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
              <SearchedResourceSkeleton name={scanUrl} />
            ) : (
              <SearchedResource
                image={/*siteFavicon*/ ''}
                name={scanUrl}
                totalPackages={packagesStats.total}
                lastScanDate={scanDate}
              />
            )}
          </div>

          <div className={styles.searchResultsSidebar}>
            <SearchResultsSidebar
              loading={isLoading}
              metaItems={metaItems}
              availableFilters={availableFilters}
              selectedFilters={selectedFilters}
              onFiltersChanged={onFiltersChange}
            />
          </div>

          <div className={styles.packages}>
            {isLoading ? (
              <>
                <PackagePreviewSkeleton />
                <PackagePreviewSkeleton />
                <PackagePreviewSkeleton />
                <PackagePreviewSkeleton />
                <PackagePreviewSkeleton />
                <PackagePreviewSkeleton />
              </>
            ) : (
              packages.map((pkg, _index) => (
                <PackagePreview key={pkg.name} pkg={pkg} opened={true /*index === 0*/} />
              ))
            )}
          </div>
        </div>
        {/*
        <CardGroups>
          <CardGroup title='Similar sites'>
            {isLoading ? <CardListSkeleton /> : <PackagesBySourceCardList cards={similarCards} />}
          </CardGroup>

          <CardGroup title='Popular packages'>
            {isLoading ? <CardListSkeleton /> : <PopularPackageCardList cards={popularPackages} />}
          </CardGroup>
        </CardGroups>
        */}
      </Container>

      <Footer />
    </>
  );
}
