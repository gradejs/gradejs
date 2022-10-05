import React from 'react';
import PortalModal from '../ReactPortal/ReactPortal';
import styles from './Modal.module.scss';
import { CSSTransition } from 'react-transition-group';
import { Button } from '../index';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

const backdropTransitionClassNames = {
  enter: styles.modalEnter,
  enterActive: styles.modalEnterActive,
  enterDone: styles.modalEnterDone,
  exit: styles.modalExit,
  exitActive: styles.modalExitActive,
  exitDone: styles.modalExitDone,
};

const contentTransitionClassNames = {
  enter: styles.contentEnter,
  enterActive: styles.contentEnterActive,
  enterDone: styles.contentEnterDone,
  exit: styles.contentExit,
  exitActive: styles.contentExitActive,
  exitDone: styles.contentExitDone,
};

// TODO: block <body> scroll when modal is open
export default function Modal({ children, isOpen, onClose }: Props) {
  return (
    <PortalModal wrapperId='modal-root'>
      {/* TODO: simplify transition classes */}
      <CSSTransition
        in={isOpen}
        timeout={600}
        classNames={backdropTransitionClassNames}
        unmountOnExit
      >
        <div className={styles.modalBackdrop} onClick={onClose} />
      </CSSTransition>

      {/* TODO: simplify transition classes */}
      <CSSTransition
        in={isOpen}
        timeout={600}
        classNames={contentTransitionClassNames}
        unmountOnExit
      >
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {children}

            <div className={styles.modalAction}>
              <Button variant='arrow' onClick={onClose}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </CSSTransition>
    </PortalModal>
  );
}
