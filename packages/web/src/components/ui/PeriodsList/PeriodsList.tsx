import React from 'react';
import ChipGroup from '../ChipGroup/ChipGroup';
import Chip from '../Chip/Chip';

type Period = {
  label: string;
  value: string;
};

type Props = {
  periodsList: Period[];
  selectedPeriod: string;
  selectHandler: (newPeriod: string) => void;
};

const PeriodsList = ({ periodsList, selectedPeriod, selectHandler }: Props) => (
  <ChipGroup>
    {periodsList.map(({ label, value }) => (
      <Chip
        key={value}
        variant={value === selectedPeriod ? 'active' : 'primary'}
        size='medium'
        onClick={() => selectHandler(value)}
      >
        {label}
      </Chip>
    ))}
  </ChipGroup>
);

export default PeriodsList;
