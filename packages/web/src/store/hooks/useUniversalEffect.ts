import { useEffect } from 'react';

export const useUniversalEffect: typeof useEffect = (effect, deps) => {
  if (__IS_SERVER__) {
    effect();
  }

  useEffect(effect, deps);
};
