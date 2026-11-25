import React, { useEffect, useRef } from 'react'
import styles from './Dialog.module.css'

export const Dialog = ({ 
  open, 
  onClose, 
  className = '', 
  ariaLabelledBy, 
  children 
}) => {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!dialogRef.current) return;

    if (open && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }

    if (!open && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, [open])
  return (
    <dialog 
      ref={dialogRef}
      aria-labelledby={ariaLabelledBy}
      onClose={onClose} 
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose?.()
        }
      }}
      className={`${styles.dialog} ${className}`}
    >
      <div className={styles.content}>{children}</div>
    </dialog>
  )
}
