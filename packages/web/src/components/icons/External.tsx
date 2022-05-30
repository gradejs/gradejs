import React from 'react';
import { IconProps } from './types';

export default function External({
  width = '19',
  height = '19',
  color = '#A5A5A5',
  className,
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox='0 0 18 19'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect y='0.678467' width='18' height='18' rx='9' fill={color} />
      <path
        d='M6 12.6785L12 6.67847M12 6.67847H6M12 6.67847L12 12.6785'
        stroke='white'
        strokeLinejoin='round'
      />
    </svg>
  );
}
