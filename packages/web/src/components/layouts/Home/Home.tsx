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
  isLoading?: boolean;
};

export default function Home({ onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const validate = useCallback(
    (data: FormData) => {
      let { address } = data;

      if (!address.startsWith('http')) {
        address = `https://${address}`;
      }

      try {
        address = new URL(address).toString(); // normalize
        onSubmit({ address });
      } catch (e) {
        setError('address', { message: 'Invalid origin format. Should be: https://example.com' });
      }

      // if (address.match(re)) {
      // } else {
      //   setError('address', { message: 'Invalid origin format. Should be: https://example.com' });
      // }
    },
    [setError]
  );

  const { address: error } = errors;

  return (
    <Wrapper className={styles.wrapper}>
      <Header />
      <Section className={styles.content}>
        <h1>Analyze webpack production bundle</h1>
        <form onSubmit={handleSubmit(validate)} noValidate>
          <TextInput
            type='url'
            className={styles.address}
            placeholder='Enter a website URL'
            name='address'
            register={register}
            error={errors.address}
            disabled={isLoading}
          />
          <Button className={styles.submit} variant='action' type='submit' disabled={isLoading}>
            Start
          </Button>

          {error?.message ? (
            <p className={clsx(styles.disclaimer, styles.error)}>{error.message}</p>
          ) : (
            <p className={clsx(styles.disclaimer)}>
              GradeJS will analyze production JavaScript files and match webpack bundled modules to
              1,826 indexed NPM libraries over 54,735 releases.{' '}
              <a
                href='https://github.com/gradejs/gradejs/discussions/6'
                target='_blank'
                rel='norefferer noreferrer'
                className={clsx(styles.learnMore)}
              >
                Learn more
              </a>
            </p>
          )}
        </form>
      </Section>
    </Wrapper>
  );
}
