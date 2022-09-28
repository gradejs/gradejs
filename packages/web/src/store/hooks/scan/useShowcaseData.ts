import { useAppDispatch, useAppSelector } from '../../index';
import { selectShowcaseData } from '../../selectors/showcase';
import { useEffect } from 'react';
import { fetchShowcaseData } from '../../slices/showcase';

export const useShowcaseData = () => {
  const dispatch = useAppDispatch();
  const showcase = useAppSelector(selectShowcaseData);

  useEffect(() => {
    if (!showcase.showcase && !showcase.isLoading && !showcase.error) {
      dispatch(fetchShowcaseData());
    }
  }, [showcase]);

  return showcase;
};
