import React, { useCallback, useMemo, useState } from 'react';
import styles from './PopularPackages.module.scss';
import modalStyles from '../../ui/Modal/Modal.module.scss';
import clsx from 'clsx';
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
import Modal from '../../ui/Modal/Modal';
import Badge from '../../ui/Badge/Badge';
import SidebarCategory from '../../ui/SidebarCategory/SidebarCategory';
import PeriodsList from '../../ui/PeriodsList/PeriodsList';

export default function PopularPackages() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const [activeModal, setActiveModal] = useState<'period' | 'keywords' | 'authors' | null>(null);
  const closeModalHandler = useCallback(() => setActiveModal(null), []);

  const anyFiltersActive = useMemo(
    () => Object.values(selectedKeywords).some((it) => !!it.length),
    [selectedKeywords]
  );

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
    periods: ['All time', '1 day', '1 week', '1 month', '6 month', '1 year'],
    keywords: ['react', 'object', 'assign', 'extend', 'properties', 'es2015'],
  };

  const handlePeriodsFilterChange = (value: string) => {
    setSelectedPeriod(value);
  };

  const handleKeywordsFilterChange = (value: string[]) => {
    setSelectedKeywords(value);
  };

  const handleKeywordsFilterReset = () => {
    setSelectedKeywords([]);
  };

  return (
    <>
      <Modal isOpen={activeModal === 'period'} onClose={closeModalHandler}>
        <div className={modalStyles.modalContentWrapper}>
          <SidebarCategory
            categoryName='Problems'
            returnButton={closeModalHandler}
            resetGroup={handleKeywordsFilterReset}
          >
            <PeriodsList
              periodsList={periodFilter}
              selectedPeriod={selectedPeriod}
              selectHandler={handlePeriodsFilterChange}
            />
          </SidebarCategory>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'keywords'} onClose={closeModalHandler}>
        <SidebarCategoryWithSearch
          categoryName='Keywords'
          keywordsList={availableFilters.keywords}
          selectedKeywords={selectedKeywords}
          selectHandler={handleKeywordsFilterChange}
          returnButton={closeModalHandler}
          resetGroup={handleKeywordsFilterReset}
          searchOpen
        />
      </Modal>

      <Modal isOpen={activeModal === 'authors'} onClose={closeModalHandler}>
        <SidebarCategoryWithSearch
          categoryName='Authors'
          keywordsList={availableFilters.keywords}
          selectedKeywords={selectedKeywords}
          selectHandler={handleKeywordsFilterChange}
          returnButton={closeModalHandler}
          resetGroup={handleKeywordsFilterReset}
          searchOpen
        />
      </Modal>

      <StickyDefaultHeader showSearch />

      <section className={styles.packagesPage}>
        <Container>
          <div className={styles.packagesPageTop}>
            <h1 className={styles.pageTitle}>Most popular NPM Packages</h1>

            <div className={styles.controls}>
              <div className={styles.controlsTop}>
                <span className={styles.controlsTopTitle}>
                  <Icon kind='filters' className={styles.controlsTopIcon} />
                  <span>Filters</span>
                </span>

                {anyFiltersActive && (
                  <span className={styles.mobileFiltersReset} onClick={handleKeywordsFilterReset}>
                    Reset
                  </span>
                )}
              </div>
              <div className={clsx(styles.controlsList, styles.controlsListMobile)}>
                <div className={styles.controlItem}>
                  <Button variant='secondary' size='small' onClick={() => setActiveModal('period')}>
                    Dynamic period
                  </Button>
                </div>
                <div className={styles.controlItem}>
                  <Button
                    variant='secondary'
                    size='small'
                    onClick={() => setActiveModal('keywords')}
                  >
                    {selectedKeywords.length > 0 && (
                      <Badge
                        content={selectedKeywords.length}
                        className={styles.controlItemBadge}
                      />
                    )}
                    Keywords
                  </Button>
                </div>
                <div className={styles.controlItem}>
                  <Button
                    variant='secondary'
                    size='small'
                    onClick={() => setActiveModal('authors')}
                  >
                    {selectedKeywords.length > 0 && (
                      <Badge
                        content={selectedKeywords.length}
                        className={styles.controlItemBadge}
                      />
                    )}
                    Authors
                  </Button>
                </div>
              </div>
              <div className={clsx(styles.controlsList, styles.controlsListDesktop)}>
                {anyFiltersActive && (
                  <div className={styles.controlItem}>
                    <span
                      className={styles.desktopFiltersReset}
                      onClick={handleKeywordsFilterReset}
                    >
                      Reset
                      <Icon
                        kind='crossOpaque'
                        color='#212121'
                        width={20}
                        height={20}
                        className={styles.desktopFiltersIcon}
                      />
                    </span>
                  </div>
                )}
                <div className={styles.controlItem}>
                  <Dropdown triggerText='Dynamic period'>
                    <div className={styles.radioGroup}>
                      {periodFilter.map(({ label, value }) => (
                        <Radio
                          key={value}
                          name='period'
                          value='all'
                          checked={selectedPeriod === value}
                          onChange={() => setSelectedPeriod(value)}
                        >
                          {label}
                        </Radio>
                      ))}
                    </div>
                  </Dropdown>
                </div>
                <div className={styles.controlItem}>
                  <Dropdown
                    triggerText='Keywords'
                    size='medium'
                    position='center'
                    selectedKeywords={selectedKeywords}
                  >
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
                  <Dropdown
                    triggerText='Authors'
                    size='medium'
                    position='right'
                    selectedKeywords={selectedKeywords}
                  >
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
                  {/* @ts-expect-error */}
                  <PackagePreview pkg={mockPackage} />
                </div>
              </div>
            </div>

            <div className={styles.numberedPackage}>
              <div className={styles.numberedPackageNumber}>2</div>
              <div className={styles.numberedPackageInner}>
                <div className={styles.numberedPackageContent}>
                  {/* @ts-expect-error */}
                  <PackagePreview pkg={mockPackage} />
                </div>
              </div>
            </div>

            <div className={styles.numberedPackage}>
              <div className={styles.numberedPackageNumber}>3</div>
              <div className={styles.numberedPackageInner}>
                <div className={styles.numberedPackageContent}>
                  {/* @ts-expect-error */}
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
