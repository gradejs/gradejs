import React, { useEffect, useRef, useState } from 'react';
import styles from './SearchResults.module.scss';
import Header from 'components/ui/Header/Header';
import Footer from 'components/ui/Footer/Footer';
import Container from 'components/ui/Container/Container';
import { Icon } from '../../ui/Icon/Icon';
import PackagePreview from '../../ui/PackagePreview/PackagePreview';
import SearchBar from '../../ui/SearchBar/SearchBar';
import SearchedResource from '../../ui/SearchedResource/SearchedResource';
import { CardProps } from '../../ui/Card/Card';
import CardGroup from '../../ui/CardGroup/CardGroup';
import CardList from '../../ui/CardList/CardList';
import CardGroups from 'components/ui/CardGroups/CardGroups';
import SidebarCategory from '../../ui/SidebarCategory/SidebarCategory';
import { Button } from '../../ui';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import SidebarMeta from '../../ui/SidebarMeta/SidebarMeta';
import clsx from 'clsx';
import Badge from '../../ui/Badge/Badge';

type Props = {
  pageLoading?: boolean;
};

export default function SearchResults({ pageLoading = false }: Props) {
  const [loading, setLoading] = useState<boolean>(pageLoading);
  const [offCanvasOpen, setOffCanvasOpen] = useState<boolean>(false);
  const [subMenu, setSubMenu] = useState('');
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

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

  const handleFiltersChange = (
    name: string,
    state: string[],
    setState: React.SetStateAction<any>
  ) => {
    const temp = [...state];

    if (temp.includes(name)) {
      const filtered = temp.filter((item) => item !== name);
      setState(filtered);
    } else {
      temp.push(name);
      setState(temp);
    }
  };

  const handleKeywordsChange = (name: string) => {
    handleFiltersChange(name, selectedKeywords, setSelectedKeywords);
  };

  const handleProblemsChange = (name: string) => {
    handleFiltersChange(name, selectedProblems, setSelectedProblems);
  };

  const handleAuthorsChange = (name: string) => {
    handleFiltersChange(name, selectedAuthors, setSelectedAuthors);
  };

  const resetFilters = () => {
    setSelectedKeywords([]);
    setSelectedProblems([]);
    setSelectedAuthors([]);
  };

  const openOffCanvas = (subMenuName: string) => {
    setOffCanvasOpen(true);
    setSubMenu(subMenuName);
  };

  const closeOffCanvas = () => {
    setOffCanvasOpen(false);
  };

  const filterToggles = [
    { name: 'keywords', state: selectedKeywords },
    { name: 'problems', state: selectedProblems },
    { name: 'authors', state: selectedAuthors },
  ];

  const isChanged =
    selectedKeywords.length > 0 || selectedProblems.length > 0 || selectedAuthors.length > 0;

  return (
    <div className={clsx(styles.offCanvas, offCanvasOpen && styles.offCanvasOpen)}>
      <div className={styles.offCanvasOverlay} onClick={closeOffCanvas} />

      <div className={styles.offCanvasMenu}>
        <div className={styles.offCanvasContent}>
          {subMenu === 'keywords' && (
            <SidebarCategory
              categoryName='Keywords'
              keywordsList={keyWords}
              selectedKeywords={selectedKeywords}
              selectHandler={handleKeywordsChange}
              renderComponent='chip'
              loading={loading}
              searchable
              searchOpen
              returnButton={closeOffCanvas}
              resetGroup={() => setSelectedKeywords([])}
            />
          )}

          {subMenu === 'problems' && (
            <div className={styles.offCanvasContentWrapper}>
              <SidebarCategory
                categoryName='Problems'
                keywordsList={vulnerabilities}
                selectedKeywords={selectedProblems}
                selectHandler={handleProblemsChange}
                renderComponent='checkbox'
                loading={loading}
                resetGroup={() => setSelectedProblems([])}
              />
            </div>
          )}

          {subMenu === 'authors' && (
            <SidebarCategory
              categoryName='Authors'
              keywordsList={authors}
              selectedKeywords={selectedAuthors}
              selectHandler={handleAuthorsChange}
              renderComponent='person'
              loading={loading}
              searchable
              searchOpen
              returnButton={closeOffCanvas}
              resetGroup={() => setSelectedAuthors([])}
            />
          )}

          <div className={styles.offCanvasAction}>
            <Button variant='arrow' onClick={closeOffCanvas}>
              Apply
            </Button>
          </div>
        </div>
      </div>

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

      <Header>
        <SearchBar value='pinterest.com/blog/%D0%92%D092%D092%D092%/dFD092fg092%D092%/dFD092/blog/%D0%92%D092%D092%D092%/dFD092fg092%D092%/dFD092f' />
      </Header>

      <Container>
        <div className={styles.searchResults}>
          <SearchedResource
            image='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
            name='pinterest.com'
            totalPackages={6}
            lastScanDate='21 feb in 21:30'
            loading={loading}
          />

          <aside className={styles.sidebar}>
            <div className={styles.sidebarItem}>
              <SidebarMeta meta={metaItems} loading={loading} />
            </div>

            <div className={clsx(styles.sidebarItem, styles.sidebarItemMobileFilter)}>
              <div className={styles.mobileFiltersTop}>
                <div className={styles.mobileFiltersTitle}>
                  <span className={styles.mobileFiltersIcon}>
                    <Icon kind='filters' width={16} height={16} color='#8E8AA0' />
                  </span>
                  Filters
                </div>

                {isChanged && (
                  <div className={styles.mobileFiltersResetWrapper}>
                    <span className={styles.mobileFiltersReset} onClick={resetFilters}>
                      Reset
                    </span>
                  </div>
                )}
              </div>

              {filterToggles.map(({ name, state }) => (
                <Button
                  key={name}
                  variant='secondary'
                  size='small'
                  className={styles.mobileFilterToggle}
                  onClick={() => openOffCanvas(name)}
                >
                  {state.length > 0 && (
                    <Badge content={state.length} className={styles.mobileSelectedCounter} />
                  )}
                  {name[0].toUpperCase() + name.slice(1)}
                </Button>
              ))}
            </div>

            <div className={clsx(styles.sidebarItem, styles.sidebarItemFilter)}>
              <SidebarCategory
                categoryName='Keywords'
                keywordsList={keyWords}
                selectedKeywords={selectedKeywords}
                selectHandler={handleKeywordsChange}
                renderComponent='chip'
                loading={loading}
                searchable
              />
            </div>

            <div className={clsx(styles.sidebarItem, styles.sidebarItemFilter)}>
              <SidebarCategory
                categoryName='Problems'
                keywordsList={vulnerabilities}
                selectedKeywords={selectedProblems}
                selectHandler={handleProblemsChange}
                renderComponent='checkbox'
                loading={loading}
              />
            </div>

            <div className={clsx(styles.sidebarItem, styles.sidebarItemFilter)}>
              <SidebarCategory
                categoryName='Authors'
                keywordsList={authors}
                selectedKeywords={selectedAuthors}
                selectHandler={handleAuthorsChange}
                renderComponent='person'
                loading={loading}
                searchable
              />
            </div>

            {isChanged && (
              <div className={clsx(styles.sidebarItem, styles.sidebarItemFilter)}>
                <Button variant='secondary' size='small' onClick={resetFilters}>
                  Reset filters
                </Button>
              </div>
            )}
          </aside>

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
    </div>
  );
}
