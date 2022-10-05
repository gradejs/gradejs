import React from 'react';
import styles from './ProblemsList.module.scss';
import Checkbox from '../Checkbox/Checkbox';
import { capitalizeWord } from '../../../utils/helpers';

type Props = {
  keywordsList: string[];
  selectedKeywords: string[];
  selectHandler: (newKeywords: string[]) => void;
};

// TODO: onChange Perf fixes
export default function ProblemsList({ keywordsList, selectedKeywords, selectHandler }: Props) {
  return (
    <div className={styles.checkboxGroup}>
      {keywordsList?.map((name) => (
        <Checkbox
          key={name}
          label={capitalizeWord(name)}
          checked={selectedKeywords.includes(name)}
          onChange={() =>
            selectHandler(
              selectedKeywords.includes(name)
                ? selectedKeywords.filter((it) => it !== name)
                : [...selectedKeywords, name]
            )
          }
        />
      ))}
    </div>
  );
}
