import React, { useCallback } from 'react';
import styles from './SearchBar.module.scss';
import { Icon } from '../Icon/Icon';
import clsx from 'clsx';

type Props = {
  size?: 'default' | 'large';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function SearchBar({
  size = 'default',
  placeholder = 'Start analyzing...',
  value,
  onChange,
  onSubmit,
}: Props) {
  const changeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const keyPressHandler = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSubmit();
      }
    },
    [onSubmit]
  );

  return (
    <div className={clsx(styles.searchBar, styles[size])}>
      <input
        type='text'
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={changeHandler}
        onKeyPress={keyPressHandler}
      />
      {!!value && (
        <button type='submit' className={styles.submit} onClick={onSubmit}>
          {size === 'large' ? (
            <Icon kind='arrow' width={17} height={30} stroke='#8E8AA0' />
          ) : (
            <Icon kind='arrow' width={9} height={18} stroke='#8E8AA0' />
          )}
        </button>
      )}
    </div>
  );
}
