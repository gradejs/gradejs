import React, { useRef, useState } from 'react';
import styles from './Dropdown.module.scss';
import clsx from 'clsx';
import Button from '../Button/Button';
import { useOnClickOutside } from 'hooks/useOutsideAlerter';
import { Icon } from '../Icon/Icon';

type Props = {
  triggerText?: string;
  size?: 'small' | 'medium';
  position?: 'left' | 'center' | 'right';
  className?: string;
  children?: React.ReactNode;
};

const Dropdown = ({
  triggerText,
  size = 'small',
  position = 'left',
  className,
  children,
}: Props) => {
  const containerRef = useRef(null);
  const [opened, setOpened] = useState(false);

  const clickOutsideHandler = () => {
    setOpened(false);
  };

  useOnClickOutside(containerRef, clickOutsideHandler);

  return (
    <div
      ref={containerRef}
      className={clsx(
        styles.container,
        opened && styles.containerOpen,
        size === 'small' && styles.small,
        size === 'medium' && styles.medium,
        position === 'left' && styles.positionLeft,
        position === 'center' && styles.positionCenter,
        position === 'right' && styles.positionRight,
        className
      )}
    >
      <Button
        variant='secondary'
        size='small'
        onClick={() => setOpened(!opened)}
        className={styles.triggerButton}
      >
        {triggerText}
        <Icon
          kind='arrowDown'
          width={10}
          height={6}
          color='#212121'
          className={styles.triggerIcon}
        />
      </Button>
      {opened && <div className={styles.content}>{children}</div>}
    </div>
  );
};

export default Dropdown;
