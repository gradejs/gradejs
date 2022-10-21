import React from 'react';
import styles from './SearchBar.module.scss';
import { Icon } from '../Icon/Icon';
import clsx from 'clsx';

type Props = {
  size?: 'default' | 'large';
  variant?: 'regular' | 'hero';
  suggestionsOpen?: boolean;
  placeholder?: string;
  value: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onClear: () => void;
  error: string;
};

export default function SearchBar({
  size = 'default',
  variant = 'regular',
  suggestionsOpen,
  placeholder = 'Start analyzing...',
  value,
  loading,
  onChange,
  onFocus,
  onClear,
  error,
}: Props) {
  return (
    <div
      className={clsx(
        styles.searchBar,
        styles[size],
        styles[variant],
        suggestionsOpen && styles.suggestionsOpen,
        error && styles.error
      )}
    >
      <input
        type='text'
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
      />
      {variant !== 'hero' ? (
        <>
          {value.length > 0 && !loading && (
            <button type='button' className={styles.clear} onClick={onClear}>
              <Icon kind='cross' width={24} height={24} className={styles.clearIcon} />
            </button>
          )}
          {loading && <span className={styles.loader} />}
        </>
      ) : (
        <button type='submit' className={styles.submit}>
          {loading ? (
            <span className={styles.loader} />
          ) : size === 'large' ? (
            <Icon kind='arrow' width={14} height={24} color='white' className={styles.submitIcon} />
          ) : (
            <Icon kind='arrow' width={9} height={18} color='white' className={styles.submitIcon} />
          )}
        </button>
      )}
    </div>
  );
}
