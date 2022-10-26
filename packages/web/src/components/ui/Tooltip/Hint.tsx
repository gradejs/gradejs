import React from 'react';
import styles from './Tooltip.module.scss';
import { usePopperTooltip, Config } from 'react-popper-tooltip';
import { Icon } from '../Icon/Icon';

type Props = {
  text: string;
};

const tooltipOptions: Config = { placement: 'top-end', offset: [20, 13] };

export default function Hint({ text }: Props) {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(tooltipOptions);

  return (
    <>
      <span className={styles.tooltipTrigger} ref={setTriggerRef}>
        <Icon kind='questionMark' width={5} height={9} stroke='white' color='white' />
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
