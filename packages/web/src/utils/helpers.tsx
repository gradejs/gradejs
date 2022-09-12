import React from 'react';

export function formatNumber(x: number) {
  return x.toLocaleString();
}

export function repeat(times: number, children: React.ReactNode) {
  return new Array(times)
    .fill(undefined)
    .map((_, idx) => <React.Fragment key={idx}>{children}</React.Fragment>);
}
