import React, { useCallback, useEffect, useState } from 'react';
import { useScanResult } from '../../store/hooks/useScanResult';
import SearchBar from '../ui/SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom';

type Props = {
  size?: 'default' | 'large';
  placeholder?: string;
};

// TODO: Dedupe logic at Home component
export default function SearchBarContainer({ size = 'default', placeholder }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState<string | undefined>(undefined);

  const submitHandler = useCallback(() => {
    setSubmittedValue(inputValue);
  }, [inputValue]);

  const navigate = useNavigate();
  const { displayUrl, scanResult } = useScanResult(submittedValue);

  useEffect(() => {
    if (scanResult && displayUrl && !scanResult.isLoading) {
      navigate(`/w/${displayUrl}`);
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
