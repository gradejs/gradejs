/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useEffect, useState, MouseEvent, MouseEventHandler} from 'react';
import clsx from 'clsx';
import styles from './Popup.module.scss';

export type Props = {
  className?: string;
  children: React.ReactNode;
  TriggerComponent: React.FunctionComponent<{onClick: MouseEventHandler, children: React.ReactNode}>;
  triggerChildren: React.ReactNode;
  position: 'topleft' | 'topright';
};

export default function Popup({
  className,
  TriggerComponent,
  triggerChildren,
  children,
  position,
}: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    document.body.addEventListener('click', () => setVisible(false));
  });
  return (<div style={{'position': 'relative'}}>
    <TriggerComponent onClick={(e: MouseEvent) => { e.stopPropagation(); setVisible(!visible); }}>{triggerChildren}</TriggerComponent>
    {visible && <div
      className={clsx(styles.basic, styles[position], className)}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>}
  </div>);
}
