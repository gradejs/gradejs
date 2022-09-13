import React, { useEffect, useRef, useState } from 'react';
import semver from 'semver';
import styles from './SearchResults.module.scss';
import Footer from 'components/ui/Footer/Footer';
import Container from 'components/ui/Container/Container';
import { Icon } from '../../ui/Icon/Icon';
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

type FiltersState = {
  filter: 'all' | 'outdated' | 'vulnerable' | 'name';
  sort: 'name' | 'size' | 'severity' | 'importDepth' | 'packagePopularity' | 'confidenceScore';
  filterPackageName?: string;
};

type Props = {
  searchQuery: string;
  host: string;
  siteFavicon: string;
  isLoading: boolean;
  isPending: boolean;
  scanOutput: RequestWebPageScanOutput;
  onFiltersApply: SubmitHandler<FiltersState>;
};

export default function SearchResults({ pageLoading = false }: Props) {
  const [loading, setLoading] = useState<boolean>(pageLoading);

  const loadingRef = useRef<LoadingBarRef>(null);

  // FIXME: just for demo purposes to show how loading bar works
  // Documentation: https://github.com/klendi/react-top-loading-bar
  // Starts the loading indicator with a random starting value between 20-30 (or startingValue),
  // then repetitively after an refreshRate (in milliseconds), increases it by a random value
  // between 2-10. This continues until it reaches 90% of the indicator's width.
  useEffect(() => {
    loadingRef?.current?.continuousStart(10, 5000);

    // After 10 seconds makes the loading indicator reach 100% of his width and then fade.
    setTimeout(() => {
      loadingRef?.current?.complete();
      setLoading(false);
    }, 60000);
  }, []);

  // TODO: memoize
  // Corresponding flags are determined by array index (packages[i] <=> flags[i]).
  const flags: Array<{ vulnerable: boolean; duplicate: boolean; outdated: boolean }> = (
    scanOutput.scanResult?.packages ?? []
  ).map((pkg) => ({
    duplicate: false, // TODO
    outdated: !!(
      pkg.registryMetadata && semver.gtr(pkg.registryMetadata.latestVersion, pkg.versionRange)
    ),
    vulnerable: (scanOutput.scanResult?.vulnerabilities[pkg.name]?.length ?? 0) > 0,
  }));

  // TODO memoize
  const outdatedCount = flags.filter((f) => f.outdated).length;

  // TODO memoize
  const keywordsList = [
    ...new Set(
      scanOutput.scanResult?.packages.reduce((acc, pkg) => {
        return acc.concat(pkg.registryMetadata?.keywords ?? []);
      }, [] as string[])
    ),
  ];

  /*
  // TODO: mock data, remove later
  const metaItems = [
    {
      icon: <Icon kind='weight' width={24} height={24} />,
      text: '159 kb webpack bundle size',
    },
    {
      icon: <Icon kind='search' width={24} height={24} color='#212121' />,
      text: '50 scripts found',
    },
    {
      icon: <Icon kind='vulnerability' width={24} height={24} color='#F3512E' />,
      text: '6 vulnerabilities in 4 packages',
    },
    {
      icon: <Icon kind='duplicate' color='#F3812E' width={24} height={24} />,
      text: '12 duplicate packages',
    },
    {
      icon: <Icon kind='outdated' color='#F1CE61' stroke='white' width={24} height={24} />,
      text: '18 outdated packages',
    },
  ];

  // TODO: mock data, remove later
  const keyWords = ['#moment', '#date', '#react', '#parse', '#fb', '#angular', '#vue', '#ember'];

  // TODO: mock data, remove later
  const vulnerabilities = ['Vulnerabilities', 'Outdated', 'Duplicate'];

  // TODO: mock data, remove later
  const authors = ['gaearon', 'acdlite', 'sophiebits', 'sebmarkbage', 'zpao', 'trueadm', 'bvaughn'];
  */

  return (
    <>
      {pageLoading && (
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
            {loading ? (
              <SearchedResourceSkeleton
                image='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
                name='pinterest.com'
              />
            ) : (
              <SearchedResource
                image={siteFavicon}
                name={host}
                totalPackages={scanOutput.scanResult?.packages.length ?? 0}
                lastScanDate={scanOutput.finishedAt}
              />
            )}
          </div>

          <div className={styles.searchResultsSidebar}>
            <SearchResultsSidebar
              metaItems={scanOutput.scanResult?.meta}
              keyWords={keyWords}
              vulnerabilities={vulnerabilities}
              authors={state.fetched.authors}
              loading={loading}
            />
          </div>

          <div className={styles.packages}>
            {loading ? (
              <>
                <PackagePreviewSkeleton />
                <PackagePreviewSkeleton />
                <PackagePreviewSkeleton />
                <PackagePreviewSkeleton />
                <PackagePreviewSkeleton />
                <PackagePreviewSkeleton />
              </>
            ) : (
              scanOutput.scanResult?.packages.map((pkg, index) => (
                <PackagePreview // TODO пробрасываем сюда данные
                  pkg={pkg}
                  flags={flags[index]}
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
