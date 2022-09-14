import React from 'react';
import styles from './ProblemsList.module.scss';
import Checkbox from '../Checkbox/Checkbox';

type Props = {
  keywordsList: string[];
  selectedKeywords: string[];
  selectHandler: (keyword: string) => void;
};

export default function ProblemsList({ keywordsList, selectedKeywords, selectHandler }: Props) {
  return (
    <div className={styles.checkboxGroup}>
      {keywordsList?.map((name) => (
        <Checkbox
          key={name}
          label={name}
          checked={selectedKeywords.includes(name)}
          onChange={() => selectHandler(name)}
        />
      ))}
    </div>
  );
}
