import React from 'react'
import styles from './Input.module.css'

const Input = ({
  size = "s",
  error = false,
  icon,
  className = "",
  ...props
}) => {
  const inputClasses = `
    ${styles.wrapper}
    ${styles[`size-${size}`]}
    ${error ? styles.hasError : ""}
    ${className}
  `.trim();

  return (
    <label className={inputClasses}>
      {icon && <span className={styles.icon}>{icon}</span>} 
      <input className={styles.input} {...props} />
    </label>
  )
}

export default Input;