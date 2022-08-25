import React from 'react';
import { IconProps } from './types';

export default function Arrow({
  width = '24',
  height = '24',
  color = '#8E8AA0',
  className,
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox='0 0 10 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M1 1.67139L9 9.17139L1 16.6714'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
