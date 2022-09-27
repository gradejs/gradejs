import React, { useCallback, useEffect, useState } from 'react';
import SearchBar from '../ui/SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom';
import { useScanResult } from '../../store/hooks/scan/useScanResult';
import { trackCustomEvent } from '../../services/analytics';

type Props = {
  initialValue?: string;
  size?: 'default' | 'large';
  placeholder?: string;
};

// TODO: Dedupe logic at Home component
export default function SearchBarContainer({
  size = 'default',
  placeholder,
  initialValue = '',
}: Props) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [submittedValue, setSubmittedValue] = useState<string | undefined>(undefined);

  const submitHandler = useCallback(() => {
    trackCustomEvent('SearchBar', 'WebsiteSubmitted');
    setSubmittedValue(inputValue);
  }, [inputValue]);

  const navigate = useNavigate();
  const { displayUrl, scanResult } = useScanResult(submittedValue, { requestRescan: true });

  useEffect(() => {
    if (scanResult && displayUrl && !scanResult.isLoading) {
      navigate(`/scan/${displayUrl}`);
    }
  }, [scanResult, displayUrl]);

  return (
    <SearchBar
      size={size}
      placeholder={placeholder}
      value={inputValue}
      onChange={setInputValue}
      onSubmit={submitHandler}
    />
  );
}
