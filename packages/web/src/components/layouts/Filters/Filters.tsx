/* eslint-disable react/button-has-type */
import React, { useEffect } from 'react';
import clsx from 'clsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, TextInput } from 'components/ui';
import Dropdown from '../../ui/Dropdown/Dropdown';
import Radio from '../../ui/Radio/Radio';
import styles from './Filters.module.scss';
import { trackCustomEvent } from '../../../services/analytics';

export type Props = {
  onSubmit: SubmitHandler<FiltersState>;
};

export type FiltersState = {
  filter: 'all' | 'outdated' | 'vulnerable' | 'name';
  sort: 'name' | 'size' | 'severity' | 'importDepth' | 'packagePopularity' | 'confidenceScore';
  filterPackageName?: string;
};

export const DefaultFiltersAndSorters: FiltersState = {
  filter: 'all',
  sort: 'severity',
};

export default function Filters({ onSubmit }: Props) {
  const { register, handleSubmit, reset, watch } = useForm<FiltersState>({
    defaultValues: DefaultFiltersAndSorters,
  });
  const watchFilterByName = watch('filter');
  let hideHandle: () => void;
  useEffect(() => {
    document.body.addEventListener('click', hideHandle);
  });

  return (
    <>
      <Dropdown
        getHideHandle={(handle) => {
          hideHandle = handle;
        }}
        className={clsx(styles.wider, styles.dropdown)}
        TriggerComponent={Button}
        triggerChildren='Filter / Sort'
        triggerArgs={{ size: 'medium' }}
        position='topright'
        onOpen={() => trackCustomEvent('Filters', 'OpenDropdown')}
      >
        <form
          className={styles.form}
          onSubmit={(e) => {
            hideHandle();
            trackCustomEvent('Filters', 'Update');
            return handleSubmit(onSubmit)(e);
          }}
        >
          <fieldset className={styles.fields}>
            <legend>Filter</legend>
            <Radio name='filter' value='all' register={register} appearance='justify'>
              All
            </Radio>
            <Radio name='filter' value='outdated' register={register} appearance='justify'>
              Outdated packages
            </Radio>
            <Radio name='filter' value='vulnerable' register={register} appearance='justify'>
              Vulnerable packages
            </Radio>
            <Radio name='filter' value='name' register={register} appearance='justify'>
              Package name
            </Radio>
            {watchFilterByName === 'name' && (
              <div className={styles.inputWider}>
                <TextInput
                  name='filterPackageName'
                  size='medium'
                  register={register}
                  placeholder='Enter package name'
                />
              </div>
            )}
          </fieldset>
          <fieldset className={styles.fields}>
            <legend>Sort</legend>
            <Radio name='sort' value='packagePopularity' register={register} appearance='justify'>
              Package popularity
            </Radio>
            <Radio name='sort' value='name' register={register} appearance='justify'>
              Name
            </Radio>
            <Radio name='sort' value='size' register={register} appearance='justify'>
              Size
            </Radio>
            <Radio name='sort' value='severity' register={register} appearance='justify'>
              Vulnerability severity
            </Radio>
            {/* <Radio name='sort' value='importDepth' register={register} appearance='justify'>Import depth</Radio> */}
            {/* <Radio name='sort' value='confidenceScore' register={register} appearance='justify'>Confidence score</Radio> */}
          </fieldset>
          <div className={styles.controls}>
            <Button onClick={() => reset()} type='submit' size='medium'>
              Reset filtering
            </Button>
            <Button type='submit' size='medium' variant='black'>
              Apply
            </Button>
          </div>
        </form>
      </Dropdown>
    </>
  );
}
