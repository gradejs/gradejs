import React, { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
  wrapperId: string;
}

export default function PortalModal({ children, wrapperId }: Props) {
  const [portalElement, setPortalElement] = useState<null | HTMLElement>(null);

  const createWrapperAndAppendToBody = (elementId: string) => {
    const element = document.createElement('div');
    element.setAttribute('id', elementId);
    document.body.appendChild(element);
    return element;
  };

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId) as HTMLElement;
    let portalCreated = false;
    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!element) {
      element = createWrapperAndAppendToBody(wrapperId);
      portalCreated = true;
    }

    setPortalElement(element);

    // cleaning up the portal element
    return () => {
      // delete the programmatically created element
      if (portalCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  // portalElement state will be null on the very first render.
  if (!portalElement) return null;

  return createPortal(children, portalElement);
}
