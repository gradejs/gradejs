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

export function plural(
  factor: number,
  singularForm: string,
  pluralForm: string,
  withFactor = true
) {
  return (withFactor ? `${factor} ` : '') + (factor === 1 ? singularForm : pluralForm);
}

export function getReadableSizeString(sizeInBytes: number) {
  if (sizeInBytes === 0) {
    return '0 B';
  }
  let i = 0;
  const byteUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  while (sizeInBytes > 1024) {
    sizeInBytes = Math.floor(sizeInBytes / 1024);
    i++;
  }

  return `${sizeInBytes} ${byteUnits[i]}`;
}

export function getFaviconUrlByHostname(hostname?: string) {
  return hostname ? `/favicons/${hostname}` : '';
}
