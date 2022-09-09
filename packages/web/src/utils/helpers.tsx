import React from 'react';

export function formatNumber(x: number) {
  return x.toLocaleString();
}

export function repeat(times: number, children: React.ReactNode) {
  return [...Array(times)].map((_, idx) => <React.Fragment key={idx}>{children}</React.Fragment>);
}
