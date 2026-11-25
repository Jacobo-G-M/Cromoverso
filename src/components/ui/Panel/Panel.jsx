import React from 'react'
import styles from './Panel.module.css'

export const Panel = ({ children }) => {
  return (
    <div className={styles.panel}>{children}</div>
  )
}
