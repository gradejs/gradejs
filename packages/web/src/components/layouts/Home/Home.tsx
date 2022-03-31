/* eslint-disable react/button-has-type */
import React, { useCallback } from 'react';
import clsx from 'clsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Header, Section, TextInput, Wrapper } from 'components/ui';
import styles from './Home.module.scss';

type FormData = {
  address: string;
};

export type Props = {
  onSubmit: SubmitHandler<FormData>;
};

export default function Home({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const validate = useCallback(
    (data: FormData) => {
      const { address } = data;
      const re = /^https?:\/\/[a-zA-Z0-9][a-zA-Z0-9-.]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

      if (address.match(re)) {
        onSubmit(data);
      } else {
        setError('address', { message: 'Invalid origin format. Should be: https://example.com' });
      }
    },
    [setError]
  );

  const { address: error } = errors;

  return (
    <Wrapper className={styles.wrapper}>
      <Header />
      <Section className={styles.content}>
        <h1>Analyze your webpack bundle</h1>
        <form onSubmit={handleSubmit(validate)}>
          <TextInput
            className={styles.address}
            placeholder='Enter your website address'
            name='address'
            register={register}
            error={errors.address}
          />
          <Button className={styles.submit} variant='action' type='submit'>
            Start
          </Button>
          <p className={clsx(styles.disclaimer, { [styles.error]: !!error?.message })}>
            {error?.message ||
              `This is an early-alpha version so the output result may be incorrect. Help us improve
            the solution by submitting a bug.`}
          </p>
        </form>
      </Section>
    </Wrapper>
  );
}
