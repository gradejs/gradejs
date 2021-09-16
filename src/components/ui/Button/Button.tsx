/* eslint-disable react/button-has-type */
import React from 'react'
import styles from './Button.module.scss'

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function Button({ type = 'button', children }: Props) {
  return <button className={styles.button} type={type}>{children}</button>
}