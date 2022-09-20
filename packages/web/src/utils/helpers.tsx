import React from 'react';

export function formatNumber(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function repeat(times: number, children: React.ReactNode) {
  return new Array(times)
    .fill(undefined)
    .map((_, idx) => <React.Fragment key={idx}>{children}</React.Fragment>);
}
