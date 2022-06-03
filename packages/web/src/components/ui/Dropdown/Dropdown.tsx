/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, MouseEvent, MouseEventHandler } from 'react';
import clsx from 'clsx';
import styles from './Dropdown.module.scss';

export type Props = {
  className?: string;
  children: React.ReactNode;
  TriggerComponent: React.FunctionComponent<{onClick: MouseEventHandler, children: React.ReactNode}>;
  triggerChildren: React.ReactNode;
  triggerArgs?: any;
  position: 'topleft' | 'topright';
  // eslint-disable-next-line no-unused-vars
  getHideHandle?: (_handle: () => void) => void;
};

export default function Dropdown({
  className,
  TriggerComponent,
  triggerChildren,
  triggerArgs,
  children,
  position,
  getHideHandle
}: Props) {
  const [visible, setVisible] = useState(false);
  getHideHandle?.(() => setVisible(false));
  return (<div style={{'position': 'relative', 'display': 'inline-block'}}>
    <TriggerComponent {...triggerArgs} onClick={(e: MouseEvent) => { e.stopPropagation(); setVisible(!visible); }}>{triggerChildren}</TriggerComponent>
    <div
      className={clsx(styles.basic, styles[position], className, { [styles.visible]: visible })}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>);
}
