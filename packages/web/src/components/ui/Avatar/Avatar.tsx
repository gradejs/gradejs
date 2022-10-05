import React from 'react';
import styles from './Avatar.module.scss';
import stylesTooltip from '../Tooltip/Tooltip.module.scss'; // TODO: is it ok to reference external styles?
import { Config, usePopperTooltip } from 'react-popper-tooltip';
import clsx from 'clsx';

type Props = {
  variant?: 'additionalAvatars';
  src?: string;
  altAsTooltip?: boolean;
  alt?: string;
  children?: React.ReactNode;
};

const tooltipOptions: Config = { placement: 'top-end', offset: [20, 13] };

const Avatar = ({ variant, src, altAsTooltip = false, alt = '', children }: Props) => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(tooltipOptions);

  return (
    <>
      <div className={clsx(styles.avatarItem, variant && styles[variant])} ref={setTriggerRef}>
        {src && <img src={src} className={styles.avatarImage} alt={alt} loading='lazy' />}
        {children}
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
