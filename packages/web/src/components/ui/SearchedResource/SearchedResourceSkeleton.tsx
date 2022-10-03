import React from 'react';
import styles from './SearchedResource.module.scss';

type Props = {
  image?: string;
  name: string;
};

export const SearchedResourceSkeleton = ({ image, name }: Props) => (
  <div className={styles.searchedResource}>
    {image && (
      <div className={styles.searchedResourceImageWrapper}>
        <img className={styles.searchedResourceImage} src={image} alt='' />
      </div>
    )}
    <div className={styles.searchedResourceContent}>
      <h3 className={styles.searchedResourceTitle}>{name}</h3>
      <div className={styles.searchedResourceSubtitle}>
        GradeJS is currently processing the website. <br />
        It may take a few minutes and depends on the number of JavaScript files and their size.
      </div>
    </div>
  </div>
);
