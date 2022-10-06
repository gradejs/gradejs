// @ts-nocheck

import React, { useState } from 'react';
import styles from './PopularPackages.module.scss';
import StickyDefaultHeader from '../../ui/Header/StickyDefaultHeader';
import Container from 'components/ui/Container/Container';
import Footer from '../../ui/Footer/Footer';
import PackagePreview from '../../ui/PackagePreview/PackagePreview';
import Button from 'components/ui/Button/Button';
import Pagination from '../../ui/Pagination/Pagination';
import { Icon } from 'components/ui/Icon/Icon';
import Dropdown from 'components/ui/Dropdown/Dropdown';
import Radio from '../../ui/Radio/Radio';
import KeywordsList from '../../ui/KeywordsList/KeywordsList';
import SidebarCategoryWithSearch from '../../ui/SidebarCategory/SidebarCategoryWithSearch';

export default function PopularPackages() {
  const [period, setPeriod] = useState('all');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const mockPackage = {
    name: 'react-art',
    version: '18.2.0',
    registryMetadata: {
      id: 1337,
      description: 'The Lodash library exported as ES modules. Generated using lodash-cli',
      keywords: ['#moment', '#date', '#time', '#parse', '#format'],
      maintainers: [
        {
          avatar: 'https://s.gravatar.com/avatar/17e414f1d3c2a1c190a1fe04d9850286',
          name: 'typescript-bot',
          email: 'typescript@microsoft.com',
        },
      ],
    },
    hostsFaviconList: [
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    ],
    totalUsageCount: 1337,
  };

  const periodFilter = [
    {
      label: 'All time',
      value: 'all',
    },
    {
      label: '1 day',
      value: '1',
    },
    {
      label: '7 day',
      value: '7',
    },
    {
      label: '1 month',
      value: '30',
    },
    {
      label: '6 months',
      value: '180',
    },
    {
      label: '1 year',
      value: '365',
    },
  ];

  const availableFilters = {
    keywords: ['react', 'object', 'assign', 'extend', 'properties', 'es2015'],
  };

  const handleKeywordsFilterChange = (value: string[]) => {
    setSelectedKeywords(value);
  };

  return (
    <>
      <StickyDefaultHeader showSearch />

      <section className={styles.packagesPage}>
        <Container>
          <div className={styles.packagesPageTop}>
            <h1 className={styles.pageTitle}>Most popular NPM Packages</h1>

            <div className={styles.controls}>
              <div className={styles.controlsTop}>
                <Icon kind='filters' className={styles.controlsTopIcon} />
                <span>Filters</span>
              </div>
              <div className={styles.controlsList}>
                <div className={styles.controlItem}>
                  <Dropdown triggerText='Dynamic period'>
                    <div className={styles.radioGroup}>
                      {periodFilter.map(({ label, value }) => (
                        <Radio
                          key={value}
                          name='period'
                          value='all'
                          checked={period === value}
                          onChange={() => setPeriod(value)}
                        >
                          {label}
                        </Radio>
                      ))}
                    </div>
                  </Dropdown>
                </div>
                <div className={styles.controlItem}>
                  <Dropdown triggerText='Keywords' size='medium' position='center'>
                    <SidebarCategoryWithSearch
                      categoryName='Keywords'
                      keywordsList={availableFilters.keywords}
                      selectedKeywords={selectedKeywords}
                      selectHandler={handleKeywordsFilterChange}
                      searchOpen
                    >
                      <KeywordsList
                        keywordsList={availableFilters.keywords}
                        selectedKeywords={selectedKeywords}
                        selectHandler={handleKeywordsFilterChange}
                      />
                    </SidebarCategoryWithSearch>
                  </Dropdown>
                </div>
                <div className={styles.controlItem}>
                  <Dropdown triggerText='Authors' size='medium' position='right'>
                    <SidebarCategoryWithSearch
                      categoryName='Authors'
                      keywordsList={availableFilters.keywords}
                      selectedKeywords={selectedKeywords}
                      selectHandler={handleKeywordsFilterChange}
                      searchOpen
                    >
                      <KeywordsList
                        keywordsList={availableFilters.keywords}
                        selectedKeywords={selectedKeywords}
                        selectHandler={handleKeywordsFilterChange}
                      />
                    </SidebarCategoryWithSearch>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.packages}>
            <div className={styles.numberedPackage}>
              <div className={styles.numberedPackageNumber}>1</div>
              <div className={styles.numberedPackageInner}>
                <div className={styles.numberedPackageContent}>
                  <PackagePreview pkg={mockPackage} />
                </div>
              </div>
            </div>

            <div className={styles.numberedPackage}>
              <div className={styles.numberedPackageNumber}>2</div>
              <div className={styles.numberedPackageInner}>
                <div className={styles.numberedPackageContent}>
                  <PackagePreview pkg={mockPackage} />
                </div>
              </div>
            </div>

            <div className={styles.numberedPackage}>
              <div className={styles.numberedPackageNumber}>3</div>
              <div className={styles.numberedPackageInner}>
                <div className={styles.numberedPackageContent}>
                  <PackagePreview pkg={mockPackage} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.pagination}>
            <Pagination />

            <Button variant='secondary' size='small' className={styles.moreButton}>
              Show more
            </Button>
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
      </section>
      <Footer />
    </>
  );
}
