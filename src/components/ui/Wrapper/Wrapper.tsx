import React from 'react';

export type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function Wrapper({ className, children }: Props) {
  return <section className={className}>{children}</section>;
}
