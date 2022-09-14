import React, { useEffect, useRef, useState } from 'react';
import styles from './SearchResults.module.scss';
import Footer from 'components/ui/Footer/Footer';
import Container from 'components/ui/Container/Container';
import { Icon } from '../../ui/Icon/Icon';
import PackagePreview from '../../ui/PackagePreview/PackagePreview';
import SearchedResource from '../../ui/SearchedResource/SearchedResource';
import { CardProps } from '../../ui/Card/Card';
import CardGroup from '../../ui/CardGroup/CardGroup';
import CardList from '../../ui/CardList/CardList';
import CardGroups from 'components/ui/CardGroups/CardGroups';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import DefaultHeader from '../../ui/Header/DefaultHeader';
import SearchResultsSidebar from 'components/ui/SearchResultsSidebar/SearchResultsSidebar';

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
  const similarCards: CardProps[] = [
    {
      id: 'uExBVGuF',
      title: 'github.com',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      packageTags: {
        featuredPackages: ['mdast-util-from-markdown', 'react', 'react-dom'],
        restPackages: 45,
      },
    },
    {
      id: '1EkL1u5g',
      title: 'fingerprint.com',
      icon: 'https://avatars.githubusercontent.com/u/67208791?s=200&v=4',
      packageTags: {
        featuredPackages: ['mdast-util-from-markdown', 'react', 'react-dom'],
        restPackages: 45,
      },
    },
    {
      id: 'mhwO2bPM',
      title: 'facebook.com',
      icon: 'https://avatars.githubusercontent.com/u/69631?s=200&v=4',
      packageTags: {
        featuredPackages: ['react'],
        restPackages: 45,
      },
    },
  ];

  // TODO: mock data, remove later
  const popularPackages: CardProps[] = [
    {
      id: 'FPsBcl8R',
      title: '@team-griffin/react-heading-section',
      description: "This package's job is to automatically determine...",
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      id: 'emtYcsUh',
      title: 'unist-util-generated',
      description: 'unist utility to check if a node is generated',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      id: 'TYIwvAfy',
      title: 'react-smooth',
      description: 'is a animation library work on React',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      id: 'Lq1pEEX7',
      title: 'unist-util-position',
      description: 'unist utility to get the positional info of nodes',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      id: 'cWOgIbmp',
      title: 'vfile-message',
      description: 'Create vfile messages',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      id: 'UT97Vpoi',
      title: 'Go to all Popular packages',
      variant: 'toAll',
    },
  ];

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
      icon: <Icon kind='bug' width={24} height={24} color='#F3512E' />,
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

      <DefaultHeader showSearch />

      <Container>
        <div className={styles.searchResults}>
          <div className={styles.searchResultsResource}>
            <SearchedResource
              image='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
              name='pinterest.com'
              totalPackages={6}
              lastScanDate='21 feb in 21:30'
              loading={loading}
            />
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
            <PackagePreview
              name='@team-griffin/react-heading-section'
              version='3.0.0 - 4.16.4'
              loading={loading}
            />
            <PackagePreview
              name='@team-griffin/react-heading-section@team-griffin/react-heading-section'
              version='3.0.0 - 4.16.4'
              loading={loading}
            />
          </div>
        </div>

        {/* TODO: Trying to fit separate domain entities within a single component seems like burden.
                  Feels like these <CardList/>'s should be separate components. */}
        <CardGroups>
          <CardGroup title='Similar sites'>
            <CardList cards={similarCards} loading={loading} />
          </CardGroup>

          <CardGroup title='Popular packages'>
            <CardList cards={popularPackages} loading={loading} />
          </CardGroup>
        </CardGroups>
      </Container>

      <Footer />
    </>
  );
}
