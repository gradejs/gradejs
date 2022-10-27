import React from 'react';
import Chip from '../Chip/Chip';
import { Icon } from '../Icon/Icon';

type Props = {
  problem: 'vulnerabilities' | 'duplicate' | 'outdated';
};

function ProblemBadge({ problem }: Props) {
  switch (problem) {
    case 'vulnerabilities':
      return (
        <Chip
          variant='vulnerabilities'
          size='badge'
          icon={<Icon kind='vulnerability' width={18} height={18} color='white' />}
        >
          Vulnerable
        </Chip>
      );
    case 'duplicate':
      return (
        <Chip
          variant='duplicate'
          size='badge'
          icon={<Icon kind='duplicate' width={18} height={18} color='white' />}
        >
          Duplicate
        </Chip>
      );
    case 'outdated':
      return (
        <Chip
          variant='outdated'
          size='badge'
          icon={<Icon kind='outdated' width={18} height={18} color='white' stroke='#F1CE61' />}
        >
          Outdated
        </Chip>
      );
  }
}

export default ProblemBadge;
