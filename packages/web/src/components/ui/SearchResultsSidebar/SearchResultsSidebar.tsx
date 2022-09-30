import React, { useState } from 'react';
import styles from './SearchResultsSidebar.module.scss';
import modalStyles from '../Modal/Modal.module.scss';
import clsx from 'clsx';
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

type MetaItemProps = {
  icon: React.ReactElement<IconProps>;
  text: string;
};

type Props = {
  metaItems: MetaItemProps[];
  keyWords: string[];
  problems: string[];
  authors: string[];
  loading: boolean;
};

export default function SearchResultsSidebar({
  metaItems,
  keyWords,
  problems,
  authors,
  loading,
}: Props) {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

  const [modalKeywordsOpen, setModalKeywordsOpen] = useState<boolean>(false);
  const [modalProblemsOpen, setModalProblemsOpen] = useState<boolean>(false);
  const [modalAuthorsOpen, setModalAuthorsOpen] = useState<boolean>(false);

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

  const filterTriggers = [
    { name: 'keywords', state: selectedKeywords, openModal: () => setModalKeywordsOpen(true) },
    { name: 'problems', state: selectedProblems, openModal: () => setModalProblemsOpen(true) },
    { name: 'authors', state: selectedAuthors, openModal: () => setModalAuthorsOpen(true) },
  ];

  const isChanged =
    selectedKeywords.length > 0 || selectedProblems.length > 0 || selectedAuthors.length > 0;

  return (
    <>
      <Modal show={modalKeywordsOpen} setShow={setModalKeywordsOpen}>
        <SidebarCategoryWithSearch
          categoryName='Keywords'
          keywordsList={keyWords}
          selectedKeywords={selectedKeywords}
          selectHandler={handleKeywordsChange}
          returnButton={() => setModalKeywordsOpen(false)}
          resetGroup={() => setSelectedKeywords([])}
          searchOpen
        />
      </Modal>

      <Modal show={modalProblemsOpen} setShow={setModalProblemsOpen}>
        <div className={modalStyles.modalContentWrapper}>
          <SidebarCategory
            categoryName='Problems'
            selectedKeywords={selectedProblems}
            returnButton={() => setModalProblemsOpen(false)}
            resetGroup={() => setSelectedProblems([])}
          >
            <ProblemsList
              keywordsList={problems}
              selectedKeywords={selectedProblems}
              selectHandler={handleProblemsChange}
            />
          </SidebarCategory>
        </div>
      </Modal>

      <Modal show={modalAuthorsOpen} setShow={setModalAuthorsOpen}>
        <SidebarCategoryWithSearch
          categoryName='Authors'
          keywordsList={authors}
          selectedKeywords={selectedAuthors}
          selectHandler={handleAuthorsChange}
          returnButton={() => setModalAuthorsOpen(false)}
          resetGroup={() => setSelectedAuthors([])}
          itemsWithImage
          searchOpen
        />
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
              isChanged={isChanged}
              resetFilters={resetFilters}
              filterTriggers={filterTriggers}
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
              keywordsList={keyWords}
              selectedKeywords={selectedKeywords}
              selectHandler={handleKeywordsChange}
            >
              <KeywordsList
                keywordsList={keyWords}
                selectedKeywords={selectedKeywords}
                selectHandler={handleKeywordsChange}
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
            <SidebarCategory categoryName='Issues' selectedKeywords={selectedProblems}>
              <ProblemsList
                keywordsList={problems}
                selectedKeywords={selectedProblems}
                selectHandler={handleProblemsChange}
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
            <SidebarCategoryWithSearch
              categoryName='Authors'
              keywordsList={authors}
              selectedKeywords={selectedAuthors}
              selectHandler={handleAuthorsChange}
              itemsWithImage
            >
              <PeopleList
                keywordsList={authors}
                selectedKeywords={selectedAuthors}
                selectHandler={handleAuthorsChange}
              />
            </SidebarCategoryWithSearch>
          )}
        </div>

        {isChanged && (
          <div className={clsx(styles.sidebarItem, styles.sidebarItemFilter)}>
            <Button variant='secondary' size='small' onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
