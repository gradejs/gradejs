import React from 'react';
import styles from './SearchDropdown.module.scss';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon/Icon';
import { SearchSuggestion } from '../../../store/slices/search';
import { plural } from '../../../utils/helpers';

type Props = {
  searchSuggestions: SearchSuggestion[];
  onSuggestionClick: () => void;
  inputValue: string;
  currentFocus: number;
  error: string;
};

const SearchDropdown = ({
  searchSuggestions,
  onSuggestionClick,
  inputValue,
  currentFocus,
  error,
}: Props) => {
  const getHighlightedText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

    return (
      <span>
        {' '}
        {parts.map((part, i) => (
          <span
            key={i}
            className={clsx(part.toLowerCase() === highlight.toLowerCase() && styles.highlight)}
          >
            {part}
          </span>
        ))}{' '}
      </span>
    );
  };

  return (
    <div className={clsx(styles.dropdown, error && styles.error)}>
      <div className={styles.suggestions}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
            <Icon kind='error' width={24} height={24} color='#F3512E' />
          </div>
        )}

        {!error &&
          searchSuggestions.map((suggestion, index) => {
            const { type, hostname, name, packageCount, description } = suggestion;
            const title = hostname ? hostname : name;

            return (
              <Link
                key={title}
                className={clsx(
                  styles.suggestion,
                  currentFocus === index && styles.suggestionActive
                )}
                to={`/${type}/${title}`}
                onClick={() => onSuggestionClick()}
              >
                <div className={styles.suggestionContent}>
                  <div className={styles.suggestionTitle}>
                    {title && getHighlightedText(title, inputValue)}
                    {/* TODO: enable this if vulnerable state will be used */}
                    {/*{vulnerable && (*/}
                    {/*  <Icon kind='bugOutlined' color='#212121' className={styles.suggestionIcon} />*/}
                    {/*)}*/}
                  </div>
                  <div className={styles.suggestionSubtitle}>
                    {description ? (
                      getHighlightedText(description, inputValue)
                    ) : (
                      <span>{plural(packageCount ?? 0, 'package', 'packages')}</span>
                    )}
                  </div>
                </div>

                {/* TODO: refactor chevron to arrow hover animation, also used on <Button variant="arrow" /> */}
                <span className={styles.arrowIcon}>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      className={styles.chevron}
                      d='M13 18L19 12L13 6'
                      stroke='#8E8AA0'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      className={styles.line}
                      pathLength='1'
                      d='M19 12L5 12'
                      stroke='#8E8AA0'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default SearchDropdown;
