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
  // siteFavicon: string;
};

function getReadableSizeString(sizeInBytes: number) {
  let i = -1;
  const byteUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
    sizeInBytes = sizeInBytes / 1024;
    i++;
  } while (sizeInBytes > 1024);

  return `${Math.max(sizeInBytes, 0.1).toFixed(1)} ${byteUnits[i]}`;
}

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
}: Props) {
  const metaItems = [
    {
      icon: <Icon kind='weight' width={24} height={24} />,
      text: `${getReadableSizeString(bundleSize)} webpack bundle size`,
    },
    {
      icon: <Icon kind='search' width={24} height={24} color='#212121' />,
      text: `${scriptsCount} scripts found`,
    },
    {
      icon: <Icon kind='vulnerability' width={24} height={24} color='#F3512E' />,
      text: `${vulnerabilitiesCount} vulnerabilities in ${packagesStats.total} packages`,
    },
    /*{
      icon: <Icon kind='duplicate' color='#F3812E' width={24} height={24} />,
      text: packagesStats.duplicate + ' duplicate packages',
    },*/
    {
      icon: <Icon kind='outdated' color='#F1CE61' stroke='white' width={24} height={24} />,
      text: `${packagesStats.outdated} outdated packages`,
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
                <PackagePreview pkg={pkg} opened={true /*index === 0*/} />
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
