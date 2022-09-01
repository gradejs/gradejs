import React, { useState } from 'react';
import styles from './SearchBar.module.scss';
import { Icon } from '../Icon/Icon';

type Props = {
  value?: string;
};

export default function SearchBar({ value }: Props) {
  // FIXME: not sure that this is legal
  const [inputText, setInputText] = useState<string | undefined>(value);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const clearHandler = () => {
    setInputText('');
  };

  return (
    <div className={styles.searchBar}>
      <input
        type='text'
        className={styles.input}
        value={inputText}
        onChange={changeHandler}
        placeholder='Start analyzing...'
      />
      {inputText ? (
        <button type='button' className={styles.clear} onClick={clearHandler}>
          <Icon kind='cross' width={24} height={24} color='#8E8AA0' />
        </button>
      ) : (
        <button type='submit' className={styles.submit}>
          <Icon kind='arrow' width={9} height={18} stroke='#8E8AA0' />
        </button>
      )}
    </div>
  );
}
