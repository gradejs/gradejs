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
import cross from '../../../assets/icons/sprite/cross.svg';
import script from '../../../assets/icons/sprite/script.svg';
import license from '../../../assets/icons/sprite/license.svg';
import bugOutlined from '../../../assets/icons/sprite/bug-outlined.svg';
import repository from '../../../assets/icons/sprite/repository.svg';
import link from '../../../assets/icons/sprite/link.svg';
import npm from '../../../assets/icons/sprite/npm.svg';
import rating from '../../../assets/icons/sprite/rating.svg';
import dependency from '../../../assets/icons/sprite/dependency.svg';
import graph from '../../../assets/icons/sprite/graph.svg';
import ratingArrow from '../../../assets/icons/sprite/rating-arrow.svg';
import check from '../../../assets/icons/sprite/check.svg';
import arrowBack from '../../../assets/icons/sprite/arrow-back.svg';
import filters from '../../../assets/icons/sprite/filters.svg';

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
  cross,
  script,
  license,
  bugOutlined,
  repository,
  link,
  npm,
  rating,
  dependency,
  graph,
  ratingArrow,
  check,
  arrowBack,
  filters,
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
      <use xlinkHref={`/static/sprite.svg#${icons[kind].id}`} />
    </svg>
  );
}
