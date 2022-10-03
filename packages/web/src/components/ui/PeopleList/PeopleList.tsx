import React from 'react';
import styles from './PeopleList.module.scss';
import Person from '../Person/Person';

type Props = {
  keywordsList: string[];
  selectedKeywords: string[];
  selectHandler: (newKeywords: string[]) => void;
};

// TODO: onChange Perf fixes
export default function PeopleList({ keywordsList, selectedKeywords, selectHandler }: Props) {
  return (
    <div className={styles.authors}>
      {keywordsList.slice(0, 4).map((person) => (
        <Person
          key={person}
          name={person}
          // TODO: Add author avatars
          // image='https://via.placeholder.com/36'
          checked={selectedKeywords.includes(person)}
          onClick={() =>
            selectHandler(
              selectedKeywords.includes(person)
                ? selectedKeywords.filter((it) => it !== person)
                : [...selectedKeywords, person]
            )
          }
        />
      ))}
    </div>
  );
}
