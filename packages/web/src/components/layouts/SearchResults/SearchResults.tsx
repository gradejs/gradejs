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
import { ClientApi } from '../../../services/apiClient';
import { IdentifiedPackage } from 'store/selectors/websiteResults';

type Props = {
  isLoading: boolean;
  isPending: boolean;
  scanUrl: string;
  packages: IdentifiedPackage[];
  packagesStats: { total: number; vulnerable: number; outdated: number };
  vulnerabilities: Record<string, ClientApi.PackageVulnerabilityResponse[]>;
  vulnerabilitiesCount: number;
  keywordsList: string[];
  scanDate?: string;
  // siteFavicon: string;
};

export default function SearchResults({
  isLoading,
  scanUrl,
  packages,
  packagesStats,
  vulnerabilitiesCount,
  vulnerabilities,
  keywordsList,
  scanDate,
}: Props) {
  const metaItems = [
    /*{
      icon: <Icon kind='weight' width={24} height={24} />,
      text: '159 kb webpack bundle size',
    },*/
    /*{
      icon: <Icon kind='search' width={24} height={24} color='#212121' />,
      text: '50 scripts found',
    },*/
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

  const authors: string[] = []; // TODO

  const problems = ['Vulnerable', 'Outdated' /*'Duplicate'*/];

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
              metaItems={metaItems}
              keyWords={keywordsList}
              problems={problems}
              authors={authors}
              loading={isLoading}
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
                <PackagePreview
                  pkg={pkg}
                  vulnerabilities={vulnerabilities[pkg.name]}
                  opened={true /*index === 0*/}
                />
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
