import React, { useCallback } from 'react';
import styles from './SidebarCategoryHiddenSearch.module.scss';
import { Icon } from '../Icon/Icon';
import clsx from 'clsx';
import Search from '../Search/Search';

type GroupItem = {
  group: string;
  children: string[];
};

type SearchItem = {
  item: string;
  selectedItems: string[];
  selectHandler: (name: string) => void;
  itemsWithImage?: boolean;
};

function SearchItem({ item, selectedItems, selectHandler, itemsWithImage }: SearchItem) {
  return (
    <div
      className={clsx(styles.groupItem, selectedItems.includes(item) && styles.groupItemActive)}
      onClick={() => selectHandler(item)}
    >
      {itemsWithImage && (
        // TODO: pass actual person image here
        <img src='https://via.placeholder.com/36' className={styles.groupItemImage} alt='' />
      )}
      <span className={styles.groupItemName}>{item}</span>
      {selectedItems.includes(item) && (
        <Icon
          kind='check'
          width={12}
          height={10}
          color='#212121'
          className={styles.groupItemCheck}
        />
      )}
    </div>
  );
}

type Props = {
  searchValue: string;
  searchChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearInput: () => void;
  alphabeticalGroups?: GroupItem[];
  selectedItems: string[];
  itemsWithImage?: boolean;
  selectHandler: (selectedKeywords: string[]) => void;
};

export default function SidebarCategoryHiddenSearch({
  searchValue,
  searchChangeHandler,
  clearInput,
  alphabeticalGroups,
  selectedItems,
  itemsWithImage,
  selectHandler,
}: Props) {
  const itemSelectionHandler = useCallback(
    (value: string) => {
      if (selectedItems.includes(value)) {
        selectHandler(selectedItems.filter((it) => it !== value));
      } else {
        selectHandler([...selectedItems, value]);
      }
    },
    [selectedItems, selectHandler]
  );

  return (
    <>
      <Search
        searchValue={searchValue}
        placeholder='Name'
        searchChangeHandler={searchChangeHandler}
        clearInput={clearInput}
      />

      {alphabeticalGroups && (
        <div className={styles.groups}>
          {alphabeticalGroups.map(({ group, children }) => (
            <div key={group}>
              {alphabeticalGroups.length > 1 && <div className={styles.groupName}>{group}</div>}

              <div className={styles.groupList}>
                {children.map((item) => (
                  <SearchItem
                    key={item}
                    item={item}
                    selectedItems={selectedItems}
                    selectHandler={itemSelectionHandler}
                    itemsWithImage={itemsWithImage}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
