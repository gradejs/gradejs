import React, { useRef } from 'react';
import styles from './SearchResults.module.scss';
import Footer from 'components/ui/Footer/Footer';
import Container from 'components/ui/Container/Container';
import PackagePreview from '../../ui/PackagePreview/PackagePreview';
import SearchedResource from '../../ui/SearchedResource/SearchedResource';
import { Icon } from '../../ui/Icon/Icon';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import SearchResultsSidebar from 'components/ui/SearchResultsSidebar/SearchResultsSidebar';
import { SearchedResourceSkeleton } from '../../ui/SearchedResource/SearchedResourceSkeleton';
import { PackagePreviewSkeleton } from '../../ui/PackagePreview/PackagePreviewSkeleton';
import StickyDefaultHeader from '../../ui/Header/StickyDefaultHeader';
import { ClientApi } from '../../../services/apiClient';
import { ScanStatus, IdentifiedPackage } from 'store/selectors/websiteResults';

type Props = {
  isLoading: boolean;
  isPending: boolean;
  searchQuery: string;
  packages: IdentifiedPackage[];
  packagesStats: { total: number; vulnerable: number; outdated: number };
  vulnerabilities: Record<string, ClientApi.PackageVulnerabilityResponse[]>;
  vulnerabilitiesCount: number;
  keywordsList: string[];
  status: ScanStatus;
  // siteFavicon: string;
};

export default function SearchResults({
  isLoading,
  searchQuery,
  packages,
  packagesStats,
  vulnerabilitiesCount,
  keywordsList,
  status,
}: Props) {
  // Documentation: https://github.com/klendi/react-top-loading-bar
  const loadingRef = useRef<LoadingBarRef>(null);
  const host = new URL(searchQuery).hostname;

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

  const problems = ['Vulnerabilities', 'Outdated' /*'Duplicate'*/];

  return (
    <>
      {isLoading && (
        <LoadingBar
          ref={loadingRef}
          color='linear-gradient(90deg, #2638D9 0%, #B22AF2 100%)'
          height={4}
          shadow={false}
          transitionTime={600}
          loaderSpeed={600}
        />
      )}

      <StickyDefaultHeader showSearch searchQuery={searchQuery} />

      <Container>
        <div className={styles.searchResults}>
          <div className={styles.searchResultsResource}>
            {isLoading ? (
              <SearchedResourceSkeleton
                image='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
                name='pinterest.com'
              />
            ) : (
              <SearchedResource
                image={/*siteFavicon*/ ''}
                name={host}
                totalPackages={packagesStats.total}
                lastScanDate={status.lastScanDate}
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
              packages.map((pkg, index) => <PackagePreview pkg={pkg} opened={index === 0} />)
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
