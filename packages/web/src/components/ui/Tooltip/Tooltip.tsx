import React from 'react';
import styles from './Tooltip.module.scss';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Icon } from '../Icon/Icon';

type Props = {
  text: string;
};

export default function Tooltip({ text }: Props) {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({ placement: 'top-end', offset: [20, 13] });

  return (
    <>
      <span className={styles.tooltipTrigger} ref={setTriggerRef}>
        <Icon kind='questionMark' width={6} height={11} stroke='white' color='white' />
      </span>

      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: styles.tooltipContainer })}>
          {text}
          <div {...getArrowProps({ className: styles.tooltipArrow })} />
        </div>
      )}
    </>
  );
}
