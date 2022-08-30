import React from 'react';
import githubLogo from '../../../assets/icons/sprite/github.svg';
import grid from '../../../assets/icons/sprite/grid.svg';
import lines from '../../../assets/icons/sprite/lines.svg';
import external from '../../../assets/icons/sprite/external.svg';
import arrow from '../../../assets/icons/sprite/arrow.svg';
import arrowDown from '../../../assets/icons/sprite/arrow-down.svg';
import bug from '../../../assets/icons/sprite/bug.svg';
import logo from '../../../assets/icons/sprite/logo.svg';
import weight from '../../../assets/icons/sprite/weight.svg';
import search from '../../../assets/icons/sprite/search.svg';
import duplicate from '../../../assets/icons/sprite/duplicate.svg';
import outdated from '../../../assets/icons/sprite/outdated.svg';

const icons = {
  githubLogo,
  grid,
  lines,
  external,
  arrow,
  bug,
  logo,
  weight,
  search,
  duplicate,
  outdated,
  arrowDown,
};

export type IconProps = {
  kind: keyof typeof icons;
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  stroke?: string;
  onClick?: () => unknown;
};

export function Icon({
  width = 16,
  height = 16,
  color = '#A5A5A5',
  stroke,
  className,
  kind,
  onClick,
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      viewBox={icons[kind].viewBox}
      fill='none'
      color={color}
      stroke={stroke}
      xmlns='http://www.w3.org/2000/svg'
    >
      <use xlinkHref={`/sprite.svg#${icons[kind].id}`} />
    </svg>
  );
}
