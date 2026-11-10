// React core hook
import React from 'react'

// Styles
import styles from './Input.module.css'

/**
 * Reusable Form Input Field Component
 *
 * Renders a stylized text input with optional leading icon and validation error styles.
 *
 * @param {Object} props
 * @param {'s'|'m'} [props.size='s'] - Size scale of the input.
 * @param {boolean} [props.error=false] - Error state flag triggering error border.
 * @param {React.ReactNode} [props.icon] - Optional icon element to display inside input.
 * @param {string} [props.className=''] - Additional custom CSS class names.
 * @returns {JSX.Element} The rendered form input wrapper.
 */
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