/* eslint-disable react/button-has-type */
import React, { useState, MouseEvent, MouseEventHandler } from 'react';
import clsx from 'clsx';
import styles from './Dropdown.module.scss';

export type Props = {
  className?: string;
  children: React.ReactNode;
  TriggerComponent: React.FunctionComponent<{
    onClick: MouseEventHandler;
    children: React.ReactNode;
  }>;
  triggerChildren?: React.ReactNode;
  triggerArgs?: any;
  triggerType?: 'click' | 'hover';
  position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  // eslint-disable-next-line no-unused-vars
  getHideHandle?: (_handle: () => void) => void;
  onOpen?: () => void;
};

export default function Dropdown({
  className,
  TriggerComponent,
  triggerChildren,
  triggerArgs,
  children,
  position,
  triggerType = 'click',
  getHideHandle,
  onOpen,
}: Props) {
  const [visible, setVisible] = useState(false);
  getHideHandle?.(() => setVisible(false));
  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={
        triggerType === 'hover'
          ? () => {
              setVisible(true);
              onOpen?.();
            }
          : undefined
      }
      onMouseLeave={triggerType === 'hover' ? () => setVisible(false) : undefined}
    >
      <TriggerComponent
        {...triggerArgs}
        onClick={
          triggerType === 'click'
            ? (e: MouseEvent) => {
                e.stopPropagation();
                if (!visible) {
                  onOpen?.();
                }
                setVisible(!visible);
              }
            : undefined
        }
      >
        {triggerChildren}
      </TriggerComponent>
      <div
        className={clsx(styles.basic, styles[position], className, { [styles.visible]: visible })}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
