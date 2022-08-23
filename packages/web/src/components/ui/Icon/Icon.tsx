import React from 'react';
import githubLogo from '../../../assets/icons/sprite/github.svg';
import grid from '../../../assets/icons/sprite/grid.svg';
import lines from '../../../assets/icons/sprite/lines.svg';
import external from '../../../assets/icons/sprite/external.svg';

const icons = { githubLogo, grid, lines, external };

export type IconProps = {
  kind: keyof typeof icons;
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  onClick?: () => unknown;
};

export function Icon({
  width = 16,
  height = 16,
  color = '#A5A5A5',
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
      xmlns='http://www.w3.org/2000/svg'
    >
      <use xlinkHref={`/static/sprite.svg#${icons[kind].id}`} />
    </svg>
  );
}
