import React from 'react';
import PortalModal from '../ReactPortal/ReactPortal';
import styles from './Modal.module.scss';
import { CSSTransition } from 'react-transition-group';
import { Button } from '../index';

type Props = {
  show: boolean;
  setShow: (value: boolean) => void;
  children?: React.ReactNode;
};

// TODO: block <body> scroll when modal is open
export default function Modal({ children, show, setShow }: Props) {
  const closeHandler = () => {
    setShow(false);
  };

  return (
    <PortalModal wrapperId='modal-root'>
      {/* TODO: simplify transition classes */}
      <CSSTransition
        in={show}
        timeout={600}
        classNames={{
          enter: styles.modalEnter,
          enterActive: styles.modalEnterActive,
          enterDone: styles.modalEnterDone,
          exit: styles.modalExit,
          exitActive: styles.modalExitActive,
          exitDone: styles.modalExitDone,
        }}
        unmountOnExit
      >
        <div className={styles.modalBackdrop} onClick={closeHandler} />
      </CSSTransition>

      {/* TODO: simplify transition classes */}
      <CSSTransition
        in={show}
        timeout={600}
        classNames={{
          enter: styles.contentEnter,
          enterActive: styles.contentEnterActive,
          enterDone: styles.contentEnterDone,
          exit: styles.contentExit,
          exitActive: styles.contentExitActive,
          exitDone: styles.contentExitDone,
        }}
        unmountOnExit
      >
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {children}

            <div className={styles.modalAction}>
              <Button variant='arrow' onClick={closeHandler}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </CSSTransition>
    </PortalModal>
  );
}
