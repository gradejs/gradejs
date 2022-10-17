import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

const ScrollToTop = ({ children }: Props) => {
  const routePath = useLocation();
  const onTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    onTop();
  }, [routePath]);

  return <>{children}</>;
};

export default ScrollToTop;
