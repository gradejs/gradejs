import React from 'react';
import styles from './Avatar.module.scss';
import stylesTooltip from '../Tooltip/Tooltip.module.scss'; // TODO: is it ok to reference external styles?
import { Config, usePopperTooltip } from 'react-popper-tooltip';

type Props = {
  src: string;
  altAsTooltip?: boolean;
  alt?: string;
};

const tooltipOptions: Config = { placement: 'top-end', offset: [20, 13] };

const Avatar = ({ src, altAsTooltip = false, alt = '' }: Props) => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(tooltipOptions);

  return (
    <>
      <div className={styles.avatarItem} ref={setTriggerRef}>
        <img src={src} className={styles.avatarImage} alt={alt} />
      </div>
      {altAsTooltip && visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: stylesTooltip.tooltipContainer })}
        >
          {alt}
          <div {...getArrowProps({ className: stylesTooltip.tooltipArrow })} />
        </div>
      )}
    </>
  );
};

export default Avatar;
