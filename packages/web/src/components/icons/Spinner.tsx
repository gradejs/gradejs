import React from 'react';
import { IconProps } from './types';

type SpinnerProps = IconProps & {
  fromColor?: string;
};

export default function Spinner({
  width = '32',
  height = '32',
  color = '#fff',
  fromColor = '#009933',
  className,
}: SpinnerProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 32 32'
    >
      <path
        stroke='url(#spinner)'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='4'
        d='M16 30c7.732 0 14-6.268 14-14 0-7.73199-6.268-14-14-14C8.26801 2 2 8.26801 2 16c0 7.732 6.26801 14 14 14Z'
      />
      <defs>
        <radialGradient
          id='spinner'
          cx='0'
          cy='0'
          r='1'
          gradientTransform='matrix(0 -14 14 0 16 16)'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor={color} />
          <stop offset='.0001' stopColor={fromColor} stopOpacity='0' />
          <stop offset='.140625' stopColor={color} stopOpacity='0' />
        </radialGradient>
      </defs>
    </svg>
  );
}
