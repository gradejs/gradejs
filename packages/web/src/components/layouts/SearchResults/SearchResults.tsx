import React, { useEffect, useRef, useState } from 'react';
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
import { packagesBySourceListData, popularPackageListData } from '../../../mocks/CardListsMocks';

type Props = {
  pageLoading?: boolean;
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

      <StickyDefaultHeader showSearch />

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
                image='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
                name='pinterest.com'
                totalPackages={6}
                lastScanDate='21 feb in 21:30'
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
            {loading ? (
              <PackagePreviewSkeleton />
            ) : (
              <PackagePreview
                name='@team-griffin/react-heading-section'
                version='3.0.0 - 4.16.4'
                desc='The Lodash library exported as ES modules. Generated using lodash-cli'
                problems={['vulnerabilities']}
                keywords={['#moment', '#date', '#time', '#parse', '#format', '#format', '#format']}
                author={{ name: 'jdalton', image: 'https://via.placeholder.com/36' }}
              />
            )}

            {loading ? (
              <PackagePreviewSkeleton />
            ) : (
              <PackagePreview
                name='@team-griffin/react-heading-section'
                version='3.0.0 - 4.16.4'
                desc='The Lodash library exported as ES modules. Generated using lodash-cli'
                problems={['vulnerabilities', 'duplicate', 'outdated']}
                keywords={['#moment', '#date', '#time', '#parse', '#format']}
                author={{ name: 'jdalton', image: 'https://via.placeholder.com/36' }}
              />
            )}
          </div>
        </div>

        <CardGroups>
          <CardGroup title='Similar sites'>
            {loading ? (
              <CardListSkeleton />
            ) : (
              <PackagesBySourceCardList cards={packagesBySourceListData} />
            )}
          </CardGroup>

          <CardGroup title='Popular packages'>
            {loading ? (
              <CardListSkeleton numberOfElements={6} />
            ) : (
              <PopularPackageCardList cards={popularPackageListData} />
            )}
          </CardGroup>
        </CardGroups>
      </Container>

      <Footer />
    </>
  );
}
