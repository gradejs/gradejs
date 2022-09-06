import React from 'react';
import styles from './SidebarCategorySearch.module.scss';
import { Icon } from '../Icon/Icon';
import clsx from 'clsx';

type listItem = {
  id: string;
  name: string;
};

type GroupItem = {
  group: string;
  children: listItem[];
};

type Props = {
  searchValue: string;
  searchChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearInput: () => void;
  list: GroupItem[] | [];
  selectedItems: string[];
  renderComponent: string;
  selectHandler: (name: string) => void;
};

export default function SidebarCategorySearch({
  searchValue,
  searchChangeHandler,
  clearInput,
  list,
  selectedItems,
  renderComponent,
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
        {list?.length > 0 &&
          list.map(({ group, children }) => (
            <div key={group}>
              {list.length > 1 && <div className={styles.groupName}>{group}</div>}
              <div className={styles.groupList}>
                {children.map(({ name, id }: listItem) => (
                  <div
                    key={id}
                    className={clsx(
                      styles.groupItem,
                      selectedItems.includes(name) && styles.groupItemActive
                    )}
                    onClick={() => selectHandler(name)}
                  >
                    {renderComponent === 'person' && (
                      <img
                        src='https://via.placeholder.com/36'
                        className={styles.groupItemImage}
                        alt=''
                      />
                    )}
                    <span className={styles.groupItemName}>{name}</span>
                    {selectedItems.includes(name) && (
                      <Icon
                        kind='check'
                        width={12}
                        height={10}
                        color='#212121'
                        className={styles.groupItemCheck}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
