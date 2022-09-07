import React, { useState } from 'react';
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

export default function SearchResults() {
  // TODO: mock date, remove later
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

  // TODO: mock date, remove later
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

  const keyWords = {
    fullList: [
      {
        id: '#art',
        name: '#art',
      },
      {
        id: '#angular',
        name: '#angular',
      },
      {
        id: '#moment',
        name: '#moment',
      },
      {
        id: '#date',
        name: '#date',
      },
      {
        id: '#react',
        name: '#react',
      },
      {
        id: '#parse',
        name: '#parse',
      },
      {
        id: '#fb',
        name: '#fb',
      },
    ],
    featuredItems: ['#moment', '#date', '#react', '#parse', '#fb'],
  };

  const vulnerabilities = ['Vulnerabilities', 'Outdated', 'Duplicate'];

  const authors = {
    fullList: [
      {
        id: 'acdlite',
        name: 'acdlite',
      },
      {
        id: 'gaearon',
        name: 'gaearon',
      },
      {
        id: 'sophiebits',
        name: 'sophiebits',
      },
      {
        id: 'trueadm',
        name: 'trueadm',
      },
    ],
    featuredItems: ['acdlite', 'gaearon', 'sophiebits', 'trueadm'],
  };

  const [selectedKeywords, setSelectedKeywords] = useState<string[] | []>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[] | []>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[] | []>([]);

  const handleFiltersChange = (
    name: string,
    state: string[] | [],
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

  const isChanged =
    selectedKeywords.length > 0 || selectedProblems.length > 0 || selectedAuthors.length > 0;

  return (
    <>
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
          />

          <aside className={styles.sidebar}>
            <div className={styles.sidebarItem}>
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>
                    <Icon kind='weight' width={24} height={24} />
                  </span>
                  <span className={styles.metaText}>159 kb webpack bundle size</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>
                    <Icon kind='search' width={24} height={24} color='#212121' />
                  </span>
                  <span className={styles.metaText}>50 scripts found</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>
                    <Icon kind='bug' width={24} height={24} color='#F3512E' />
                  </span>
                  <span className={styles.metaText}>6 vulnerabilities in 4&nbsp;packages</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>
                    <Icon kind='duplicate' color='#F3812E' width={24} height={24} />
                  </span>
                  <span className={styles.metaText}>12 duplicate packages</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>
                    <Icon kind='outdated' color='#F1CE61' stroke='white' width={24} height={24} />
                  </span>
                  <span className={styles.metaText}>18 outdated packages</span>
                </div>
              </div>
            </div>

            <div className={styles.sidebarItem}>
              <SidebarCategory
                category={keyWords}
                selectedKeywords={selectedKeywords}
                selectHandler={handleKeywordsChange}
                renderComponent='chip'
                searchable
              />
            </div>

            <div className={styles.sidebarItem}>
              <SidebarCategory
                simpleCategory={vulnerabilities}
                selectedKeywords={selectedProblems}
                selectHandler={handleProblemsChange}
                renderComponent='checkbox'
              />
            </div>

            <div className={styles.sidebarItem}>
              <SidebarCategory
                category={authors}
                selectedKeywords={selectedAuthors}
                selectHandler={handleAuthorsChange}
                renderComponent='person'
                searchable
              />
            </div>

            {isChanged && (
              <div className={styles.sidebarItem}>
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
            />
            <PackagePreview
              name='@team-griffin/react-heading-section@team-griffin/react-heading-section'
              version='3.0.0 - 4.16.4'
            />
          </div>
        </div>

        <CardGroups>
          <CardGroup title='Similar sites'>
            <CardList cards={similarCards} />
          </CardGroup>

          <CardGroup title='Popular packages'>
            <CardList cards={popularPackages} />
          </CardGroup>
        </CardGroups>
      </Container>

      <Footer />
    </>
  );
}
