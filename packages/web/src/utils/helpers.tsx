import React from 'react';

export function capitalizeWord(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function formatNumber(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function repeat(times: number, children: React.ReactNode) {
  return new Array(times)
    .fill(undefined)
    .map((_, idx) => <React.Fragment key={idx}>{children}</React.Fragment>);
}
