import React from 'react';
import { IconProps } from './types';

export default function Grid({
  width = '16',
  height = '16',
  color = '#0F0F0F',
  className,
  onClick,
}: IconProps) {
  return (
    <svg
      onClick={onClick}
      className={className}
      width={width}
      height={height}
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect x='1' y='1' width='16' height='16' rx='1' stroke={color} strokeLinejoin='round' />
      <path d='M1 9H17' stroke={color} />
      <path d='M9 1L9 17' stroke={color} />
    </svg>
  );
}
