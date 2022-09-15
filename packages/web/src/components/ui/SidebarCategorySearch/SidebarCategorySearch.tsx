import React from 'react';
import styles from './SidebarCategorySearch.module.scss';
import { Icon } from '../Icon/Icon';
import clsx from 'clsx';

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
  alphabeticalGroups: GroupItem[];
  selectedItems: string[];
  itemsWithImage?: boolean;
  selectHandler: (name: string) => void;
};

export default function SidebarCategorySearch({
  searchValue,
  searchChangeHandler,
  clearInput,
  alphabeticalGroups,
  selectedItems,
  itemsWithImage,
  selectHandler,
}: Props) {
  return (
    <>
      <div className={styles.searchWrapper}>
        {/* FIXME: Don't know why looking glass icon needs to be to the left side and */}
        {/* disappear if input is not empty. Why not show it on right side only like in */}
        {/* header search bar and toggle clear icon when not empty, probably design mistake */}
        {searchValue.length === 0 && (
          <Icon
            kind='search'
            width={24}
            height={24}
            color='#8E8AA0'
            className={styles.lookingGlass}
          />
        )}
        <input
          type='text'
          className={clsx(styles.search, searchValue.length === 0 && styles.searchEmpty)}
          placeholder='Name'
          value={searchValue}
          onChange={searchChangeHandler}
        />
        {searchValue.length > 0 && (
          <span className={styles.clearWrapper}>
            <Icon kind='cross' color='#8E8AA0' className={styles.clear} onClick={clearInput} />
          </span>
        )}
      </div>

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
                  selectHandler={selectHandler}
                  itemsWithImage={itemsWithImage}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
