/* eslint-disable react/button-has-type */
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Header, Section, TextInput } from 'components/ui';
import styles from './Home.module.scss';

type FormData = {
  address: string;
};

export type Props = {
  onSubmit: SubmitHandler<FormData>;
};

export default function Home({ onSubmit }: Props) {
  const { register, handleSubmit } = useForm<FormData>();

  return (
    <>
      <Header />
      <Section>
        <h1>Analyse your webpack bundle</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            className={styles.address}
            placeholder='https://facebook.com'
            name='address'
            register={register}
          />
          <Button className={styles.submit} variant='action' type='submit'>
            Start
          </Button>
        </form>
      </Section>
    </>
  );
}
