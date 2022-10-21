import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './SearchBarContainer.module.scss';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { useScanResult } from '../../store/hooks/scan/useScanResult';
import { trackCustomEvent } from '../../services/analytics';
import { fetchSearchData, resetSearch } from '../../store/slices/search';
import { selectSearchResults } from '../../store/selectors/search';
// import PortalModal from 'components/ui/ReactPortal/ReactPortal';
import SearchBar from '../ui/SearchBar/SearchBar';
import SearchDropdown from '../ui/SearchDropdown/SearchDropdown';
import useOnClickOutside from '../../hooks/useClickOutside';
import { SearchSuggestion } from '../../mocks/SearchSuggestions';
import { Error } from '../layouts';

type Props = {
  initialValue?: string;
  size?: 'default' | 'large';
  variant?: 'regular' | 'hero';
  placeholder?: string;
};

// TODO: Dedupe logic at Home component
export default function SearchBarContainer({
  size = 'default',
  variant = 'regular',
  placeholder,
  initialValue = '',
}: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchDataResults = useAppSelector(selectSearchResults);

  const searchContainerRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  const [submittedValue, setSubmittedValue] = useState<string | undefined>(undefined);
  const [highlight, setHighlight] = useState('');
  const [error, setError] = useState('');

  const { displayUrl, scanResult } = useScanResult(submittedValue, { requestRescan: true });

  useEffect(() => {
    if (scanResult && displayUrl && !scanResult.isLoading) {
      navigate(`/scan/${displayUrl}`);
    }
  }, [scanResult, displayUrl]);

  const submitHandler = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      setSubmittedValue(inputValue);
      setDropdownOpen(false);
      dispatch(resetSearch());

      const trackCategory = variant === 'hero' ? 'HomePage' : 'SearchBar';
      trackCustomEvent(trackCategory, 'WebsiteSubmitted');
    },
    [inputValue]
  );

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const clearHandler = () => {
    setInputValue('');
    setError('');
    dispatch(resetSearch());
  };

  // const handleSearchClose = () => {
  //   setDropdownOpen(false);
  // };

  const focusHandler = () => {
    if (searchDataResults.length && inputValue.length > 0) {
      setDropdownOpen(true);
    }
  };

  const getSearchResults = useCallback(
    debounce((value) => {
      setLoading(true);
      setError('');
      setHighlight(value);

      dispatch(fetchSearchData(value))
        .unwrap()
        .then(() => {
          setLoading(false);
          setDropdownOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setDropdownOpen(true);
          setError(err.message);
        });
    }, 300),
    []
  );

  const suggestionClickHandler = (suggestion: SearchSuggestion) => {
    setInputValue(suggestion.title);
    setDropdownOpen(false);
    dispatch(resetSearch());
  };

  const clickOutsideHandler = () => {
    setDropdownOpen(false);
  };

  useOnClickOutside(searchContainerRef, clickOutsideHandler);

  useEffect(() => {
    if (inputValue !== '' && inputValue !== initialValue) {
      getSearchResults(inputValue);
    }

    if (inputValue === '') {
      setDropdownOpen(false);
      setError('');
    }
  }, [inputValue, dispatch]);

  if (displayUrl && scanResult?.error) {
    return <Error host={displayUrl} />;
  }

  return (
    <>
      {/*{inputValue.length > 0 && dropdownOpen && (*/}
      {/*  <PortalModal wrapperId='search-root'>*/}
      {/*    <div className={styles.overlay} onClick={handleSearchClose} />*/}
      {/*  </PortalModal>*/}
      {/*)}*/}

      <form ref={searchContainerRef} className={styles.searchBarContainer} onSubmit={submitHandler}>
        <SearchBar
          size={size}
          variant={variant}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleSearchTextChange}
          onFocus={focusHandler}
          onClear={clearHandler}
          loading={loading}
          suggestionsOpen={dropdownOpen}
          error={error}
        />

        {inputValue.length > 0 && dropdownOpen && (
          <SearchDropdown
            searchSuggestions={searchDataResults}
            onSuggestionClick={suggestionClickHandler}
            inputValue={highlight}
            error={error}
          />
        )}
      </form>
    </>
  );
}
