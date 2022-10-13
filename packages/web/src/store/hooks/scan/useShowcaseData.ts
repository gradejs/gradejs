import { useAppDispatch, useAppSelector } from '../../index';
import { selectShowcaseData } from '../../selectors/showcase';
import { fetchShowcaseData } from '../../slices/showcase';
import { useUniversalEffect } from '../useUniversalEffect';

export const useShowcaseData = () => {
  const dispatch = useAppDispatch();
  const showcase = useAppSelector(selectShowcaseData);

  useUniversalEffect(() => {
    if (!showcase.showcase && !showcase.isLoading && !showcase.error) {
      dispatch(fetchShowcaseData());
    }
  }, [showcase]);

  return showcase;
};
