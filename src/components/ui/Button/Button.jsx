import React from 'react'
import styles from './Button.module.css'

const Button = ({
  children,
  variant = "primary",
  size = "s",
  className = "",
  circle = false,
  ...props
}) => {
  const buttonClasses = `
    ${styles.button}
    ${styles[`variant-${variant}`]}
    ${styles[`size-${size}`]}
    ${circle ? styles.circle : ''}
    ${className}
  `.trim();

  return (
    <button type="button" className={buttonClasses} {...props}>
      {children}
    </button>
  )
}

export default Button