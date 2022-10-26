import React from 'react';
import styles from './Search.module.scss';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';

type Props = {
  searchValue: string;
  placeholder?: string;
  searchChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearInput: () => void;
};

const Search = ({ searchValue, placeholder, searchChangeHandler, clearInput }: Props) => {
  return (
    <div className={styles.searchWrapper}>
      {/* FIXME: Don't know why looking glass icon needs to be to the left side and */}
      {/* disappear if input is not empty. Why not show it on right side only like in */}
      {/* header search bar and toggle clear icon when not empty, probably design mistake */}
      {searchValue.length === 0 && (
        <Icon
          kind='search'
          width={16}
          height={16}
          color='#8E8AA0'
          className={styles.lookingGlass}
        />
      )}
      <input
        type='text'
        className={clsx(styles.search, searchValue.length === 0 && styles.searchEmpty)}
        placeholder={placeholder}
        value={searchValue}
        onChange={searchChangeHandler}
      />
      {searchValue.length > 0 && (
        <span className={styles.clearWrapper}>
          <Icon kind='cross' color='#8E8AA0' className={styles.clear} onClick={clearInput} />
        </span>
      )}
    </div>
  );
};

export default Search;
