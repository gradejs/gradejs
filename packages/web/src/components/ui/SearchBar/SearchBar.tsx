import React, { useState } from 'react';
import styles from './SearchBar.module.scss';
import { Icon } from '../Icon/Icon';
import clsx from 'clsx';

type Props = {
  value?: string;
  size?: 'default' | 'large';
  placeholder?: string;
};

export default function SearchBar({
  value,
  size = 'default',
  placeholder = 'Start analyzing...',
}: Props) {
  // FIXME: not sure that this is legal
  const [inputText, setInputText] = useState<string | undefined>(value);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const clearHandler = () => {
    setInputText('');
  };

  return (
    <div className={clsx(styles.searchBar, styles[size])}>
      <input
        type='text'
        className={styles.input}
        value={inputText}
        onChange={changeHandler}
        placeholder={placeholder}
      />
      {inputText ? (
        <button type='button' className={styles.clear} onClick={clearHandler}>
          {size === 'large' ? (
            <Icon kind='cross' width={32} height={32} color='#8E8AA0' />
          ) : (
            <Icon kind='cross' width={24} height={24} color='#8E8AA0' />
          )}
        </button>
      ) : (
        <button type='submit' className={styles.submit}>
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
