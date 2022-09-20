import { useEffect, useState } from 'react';
import throttle from 'lodash.throttle';

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };
    const throttledUpdate = throttle(updatePosition, 250);

    window.addEventListener('scroll', throttledUpdate);

    throttledUpdate();

    return () => window.removeEventListener('scroll', throttledUpdate);
  }, []);

  return scrollPosition;
};
