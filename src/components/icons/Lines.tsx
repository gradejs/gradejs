import React from 'react';
import { IconProps } from './types';

export default function Lines({
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
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M0 4H16' stroke={color} strokeWidth='1.2' />
      <path d='M0 8H16' stroke={color} strokeWidth='1.2' />
      <path d='M0 12H16' stroke={color} strokeWidth='1.2' />
    </svg>
  );
}
