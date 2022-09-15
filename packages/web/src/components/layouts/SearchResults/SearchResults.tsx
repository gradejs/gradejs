import React, { useRef } from 'react';
import styles from './SearchResults.module.scss';
import Footer from 'components/ui/Footer/Footer';
import Container from 'components/ui/Container/Container';
import PackagePreview from '../../ui/PackagePreview/PackagePreview';
import SearchedResource from '../../ui/SearchedResource/SearchedResource';
import CardGroup from '../../ui/CardGroup/CardGroup';
import CardGroups from 'components/ui/CardGroups/CardGroups';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import SearchResultsSidebar from 'components/ui/SearchResultsSidebar/SearchResultsSidebar';
import { SearchedResourceSkeleton } from '../../ui/SearchedResource/SearchedResourceSkeleton';
import { PackagePreviewSkeleton } from '../../ui/PackagePreview/PackagePreviewSkeleton';
import { CardListSkeleton } from '../../ui/CardList/CardListSkeleton';
import StickyDefaultHeader from '../../ui/Header/StickyDefaultHeader';
import PackagesBySourceCardList from '../../ui/CardList/PackagesBySourceCardList';
import PopularPackageCardList from '../../ui/CardList/PopularPackageCardList';
import { RequestWebPageScanOutput } from '../../../services/apiClient';
import { SubmitHandler } from 'react-hook-form';
import { ClientApi } from '../../../services/apiClient';
import { ScanStatus, IdentifiedPackage } from 'store/selectors/websiteResults';

type Props = {
  isLoading: boolean;
  isPending: boolean;
  searchQuery: string;
  packages: IdentifiedPackage[];
  packagesStats: { total: number; vulnerable: number; outdated: number };
  vulnerabilities: Record<string, ClientApi.PackageVulnerabilityResponse[]>;
  keywordsList: string[];
  status: ScanStatus;
  // siteFavicon: string;
};

export default function SearchResults({
  isLoading,
  isPending,
  searchQuery,
  packages,
  packagesStats,
  vulnerabilities,
  keywordsList,
  status,
}: Props) {
  // Documentation: https://github.com/klendi/react-top-loading-bar
  const loadingRef = useRef<LoadingBarRef>(null);

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

      <StickyDefaultHeader showSearch query={searchQuery} />

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
                image={siteFavicon}
                name={host}
                totalPackages={totalPackages}
                lastScanDate={finishedAt}
              />
            )}
          </div>

          <div className={styles.searchResultsSidebar}>
            <SearchResultsSidebar
              metaItems={metaItems}
              keyWords={keyWords}
              vulnerabilities={vulnerabilities}
              authors={authors}
              loading={loading}
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
              packages.map((pkg, index) => (
                <PackagePreview
                  pkg={pkg}
                  sites={[] /* TODO */}
                  opened={index === 0}
                  totalRatedPackages={totalRatedPackages}
                />
              ))
            )}
          </div>
        </div>

        <CardGroups>
          <CardGroup title='Similar sites'>
            {loading ? (
              <CardListSkeleton />
            ) : (
              <PackagesBySourceCardList cards={state.fetched.similarCards} />
            )}
          </CardGroup>

          <CardGroup title='Popular packages'>
            {loading ? (
              <CardListSkeleton />
            ) : (
              <PopularPackageCardList cards={state.fetched.popularPackages} />
            )}
          </CardGroup>
        </CardGroups>
      </Container>

      <Footer />
    </>
  );
}
