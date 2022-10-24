import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './SearchResultsSidebar.module.scss';
import modalStyles from '../Modal/Modal.module.scss';
import clsx from 'clsx';
import debounce from 'lodash.debounce';
import Modal from '../Modal/Modal';
import SidebarMeta from '../SidebarMeta/SidebarMeta';
import SidebarMobileFilter from '../SidebarMobileFilter/SidebarMobileFilter';
import SidebarCategory from '../SidebarCategory/SidebarCategory';
import SidebarCategoryHeaderSkeleton from '../SidebarCategory/SidebarCategoryHeaderSkeleton';
import SidebarCategoryWithSearch from '../SidebarCategory/SidebarCategoryWithSearch';
import KeywordsList from '../KeywordsList/KeywordsList';
import { KeywordsListSkeleton } from '../KeywordsList/KeywordsListSkeleton';
import ProblemsList from '../ProblemsList/ProblemsList';
import { ProblemsListSkeleton } from '../ProblemsList/ProblemsListSkeleton';
import PeopleList from '../PeopleList/PeopleList';
import { PeopleListSkeleton } from '../PeopleList/PeopleListSkeleton';
import { Button } from '../index';
import { IconProps } from '../Icon/Icon';
import { SidebarMetaSkeleton } from '../SidebarMeta/SidebarMetaSkeleton';
import { SidebarMobileFilterSkeleton } from '../SidebarMobileFilter/SidebarMobileFilterSkeleton';
import {
  PackageFilters,
  PackageSorters,
  PackageSortType,
  PackageTrait,
} from '../../../store/slices/scanDisplayOptions';
import SortsList from '../SortsList/SortsList';
import SidebarCategorySearch from '../SidebarCategory/SidebarCategorySearch';
import SidebarCategorySearchSkeleton from '../SidebarCategory/SidebarCategorySearchSkeleton';

type MetaItemProps = {
  icon: React.ReactElement<IconProps>;
  text: string;
};

type Props = {
  loading?: boolean;
  metaItems: MetaItemProps[];
  availableFilters: PackageFilters;
  selectedFilters: PackageFilters;
  onFiltersChanged: (newFilters: PackageFilters | null) => void;
  availableSorters: PackageSortType[];
  onSortChange: (newSorterName: PackageSortType) => void;
  selectedSorters: PackageSorters;
  onFiltersReset: () => void;
};

export default function SearchResultsSidebar({
  metaItems,
  availableFilters,
  selectedFilters,
  onFiltersChanged,
  availableSorters,
  onSortChange,
  selectedSorters,
  onFiltersReset,
  loading,
}: Props) {
  const [activeModal, setActiveModal] =
    useState<'keywords' | 'authors' | 'traits' | 'sort' | null>(null);
  const closeModalHandler = useCallback(() => setActiveModal(null), []);

  const [rawSearchValue, setRawSearchValue] = useState('');
  const searchText = selectedFilters.searchText ?? '';

  useEffect(() => {
    setRawSearchValue(searchText);
  }, [searchText]);

  const anyFiltersActive = useMemo(
    () => Object.values(selectedFilters).some((it) => !!it.length),
    [selectedFilters]
  );

  const mobileFilterTriggers = useMemo(
    () => [
      {
        name: 'Problems',
        count: selectedFilters.traits.length,
        onOpen: () => setActiveModal('traits'),
      },
      {
        name: 'Keywords',
        count: selectedFilters.keywords.length,
        onOpen: () => setActiveModal('keywords'),
      },
      {
        name: 'Authors',
        count: selectedFilters.authors.length,
        onOpen: () => setActiveModal('authors'),
      },
    ],
    [selectedFilters]
  );

  // TODO: Refactor this through restructuring underlying components properly
  const {
    handleSearchTextChange,
    handleTraitsFilterChange,
    handleTraitsFilterReset,
    handleKeywordsFilterChange,
    handleKeywordsFilterReset,
    handleAuthorsFilterChange,
    handleAuthorsFilterReset,
  } = useMemo(
    () => ({
      handleTraitsFilterChange: (newTraits: string[]) =>
        onFiltersChanged({
          ...selectedFilters,
          traits: newTraits as PackageTrait[],
        }),
      handleTraitsFilterReset: () =>
        onFiltersChanged({
          ...selectedFilters,
          traits: [],
        }),
      handleKeywordsFilterChange: (newKeywords: string[]) =>
        onFiltersChanged({
          ...selectedFilters,
          keywords: newKeywords,
        }),
      handleKeywordsFilterReset: () =>
        onFiltersChanged({
          ...selectedFilters,
          keywords: [],
        }),
      handleAuthorsFilterChange: (newAuthors: string[]) =>
        onFiltersChanged({
          ...selectedFilters,
          authors: newAuthors,
        }),
      handleAuthorsFilterReset: () =>
        onFiltersChanged({
          ...selectedFilters,
          authors: [],
        }),
      handleSearchTextChange: (newSearchText: string) =>
        onFiltersChanged({
          ...selectedFilters,
          searchText: newSearchText,
        }),
    }),
    [onFiltersChanged, selectedFilters]
  );

  const debouncedSearchTextChangeHandler = useCallback(debounce(handleSearchTextChange, 300), [
    handleSearchTextChange,
  ]);

  const handleRawSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawSearchValue(e.target.value);
    debouncedSearchTextChangeHandler(e.target.value);
  };

  const clearSearchInput = () => {
    setRawSearchValue('');
    handleSearchTextChange('');
  };

  return (
    <>
      <Modal isOpen={activeModal === 'keywords'} onClose={closeModalHandler}>
        <SidebarCategoryWithSearch
          categoryName='Keywords'
          keywordsList={availableFilters.keywords}
          selectedKeywords={selectedFilters.keywords}
          selectHandler={handleKeywordsFilterChange}
          returnButton={closeModalHandler}
          resetGroup={handleKeywordsFilterReset}
          searchOpen
        />
      </Modal>

      <Modal isOpen={activeModal === 'traits'} onClose={closeModalHandler}>
        <div className={modalStyles.modalContentWrapper}>
          <SidebarCategory
            categoryName='Problems'
            selectedKeywords={selectedFilters.traits}
            returnButton={closeModalHandler}
            resetGroup={handleTraitsFilterReset}
          >
            <ProblemsList
              keywordsList={availableFilters.traits}
              selectedKeywords={selectedFilters.traits}
              selectHandler={handleTraitsFilterChange}
            />
          </SidebarCategory>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'authors'} onClose={closeModalHandler}>
        <SidebarCategoryWithSearch
          categoryName='Authors'
          keywordsList={availableFilters.authors}
          selectedKeywords={selectedFilters.authors}
          selectHandler={handleAuthorsFilterChange}
          returnButton={closeModalHandler}
          resetGroup={handleAuthorsFilterReset}
          itemsWithImage
          searchOpen
        />
      </Modal>

      <Modal isOpen={activeModal === 'sort'} onClose={closeModalHandler}>
        <div className={modalStyles.modalContentWrapper}>
          <SidebarCategory categoryName='Sort by' returnButton={closeModalHandler}>
            <SortsList
              availableSorters={availableSorters}
              onSortChange={onSortChange}
              selectedSorters={selectedSorters}
            />
          </SidebarCategory>
        </div>
      </Modal>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarItem}>
          {loading ? <SidebarMetaSkeleton /> : <SidebarMeta meta={metaItems} />}
        </div>

        <div className={clsx(styles.sidebarItem, styles.sidebarItemMobileFilter)}>
          {loading ? (
            <SidebarMobileFilterSkeleton />
          ) : (
            <SidebarMobileFilter
              selectedSorters={selectedSorters}
              isChanged={anyFiltersActive}
              onFiltersReset={onFiltersReset}
              filterTriggers={mobileFilterTriggers}
              onSortOpen={() => setActiveModal('sort')}
            />
          )}
        </div>

        <div className={clsx(styles.sidebarItem, styles.sidebarItemFilter)}>
          {loading ? (
            <>
              <SidebarCategoryHeaderSkeleton search />
              <SidebarCategorySearchSkeleton />
            </>
          ) : (
            <SidebarCategorySearch
              categoryName='Search by text'
              searchValue={rawSearchValue}
              handleSearchTextChange={handleRawSearchTextChange}
              clearSearchInput={clearSearchInput}
            />
          )}
        </div>

        <div className={clsx(styles.sidebarItem, styles.sidebarItemFilter)}>
          {loading ? (
            <>
              <SidebarCategoryHeaderSkeleton search />
              <KeywordsListSkeleton />
            </>
          ) : (
            <SidebarCategoryWithSearch
              categoryName='Keywords'
              keywordsList={availableFilters.keywords}
              selectedKeywords={selectedFilters.keywords}
              selectHandler={handleKeywordsFilterChange}
            >
              <KeywordsList
                keywordsList={availableFilters.keywords}
                selectedKeywords={selectedFilters.keywords}
                selectHandler={handleKeywordsFilterChange}
              />
            </SidebarCategoryWithSearch>
          )}
        </div>

        <div className={clsx(styles.sidebarItem, styles.sidebarItemFilter)}>
          {loading ? (
            <>
              <SidebarCategoryHeaderSkeleton />
              <ProblemsListSkeleton />
            </>
          ) : (
            <SidebarCategory categoryName='Issues' selectedKeywords={selectedFilters.traits}>
              <ProblemsList
                keywordsList={availableFilters.traits}
                selectedKeywords={selectedFilters.traits}
                selectHandler={handleTraitsFilterChange}
              />
            </SidebarCategory>
          )}
        </div>

        <div className={clsx(styles.sidebarItem, styles.sidebarItemFilter)}>
          {loading ? (
            <>
              <SidebarCategoryHeaderSkeleton search />
              <PeopleListSkeleton />
            </>
          ) : (
            // TODO: Add author avatars
            <SidebarCategoryWithSearch
              categoryName='Authors'
              keywordsList={availableFilters.authors}
              selectedKeywords={selectedFilters.authors}
              selectHandler={handleAuthorsFilterChange}
            >
              <PeopleList
                keywordsList={availableFilters.authors}
                selectedKeywords={selectedFilters.authors}
                selectHandler={handleAuthorsFilterChange}
              />
            </SidebarCategoryWithSearch>
          )}
        </div>

        {anyFiltersActive && (
          <div className={clsx(styles.sidebarItem, styles.sidebarItemFilter)}>
            <Button variant='secondary' size='small' onClick={onFiltersReset}>
              Reset filters
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
