// React core hook
import React from 'react'

// Styles
import styles from './Input.module.css'

/**
 * Reusable Form Input Field Component
 *
 * Renders a stylized text input with optional leading icon, trailing element,
 * ref forwarding (React 19), and validation error styles.
 *
 * @param {Object} props
 * @param {'s'|'m'} [props.size='s'] - Size scale of the input.
 * @param {'pill'|'rounded'} [props.shape='pill'] - Border radius style of the input.
 * @param {boolean} [props.error=false] - Error state flag triggering error border.
 * @param {React.ReactNode} [props.icon] - Optional icon element to display inside input.
 * @param {React.ReactNode} [props.rightElement] - Optional trailing element (e.g. password toggle button).
 * @param {string} [props.className=''] - Additional custom CSS class names.
 * @param {React.Ref} [props.ref] - Ref forwarded directly to the underlying <input> element.
 * @returns {JSX.Element} The rendered form input wrapper.
 */
const Input = ({
  size = "s",
  shape = "pill",
  error = false,
  icon,
  rightElement,
  className = "",
  ref,
  ...props
}) => {
  const inputClasses = `
    ${styles.wrapper}
    ${styles[`size-${size}`]}
    ${styles[`shape-${shape}`]}
    ${error ? styles.hasError : ""}
    ${className}
  `.trim();

  return (
    <div className={inputClasses}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <input ref={ref} className={styles.input} {...props} />
      {rightElement && <span className={styles.rightElement}>{rightElement}</span>}
    </div>
  )
}

export default Input;
