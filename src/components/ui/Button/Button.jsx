// React core hook
import React from 'react'

// Styles
import styles from './Button.module.css'

/**
 * Reusable Button / Link Component
 *
 * Renders either a native HTML <button> or an <a> anchor tag when 'href' is provided.
 * Supports multiple design system variants, sizes, and circular icon button mode.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content or icon to display inside the button.
 * @param {'primary'|'secondary'|'accent'|'ghost'} [props.variant='primary'] - Visual color theme.
 * @param {'s'|'m'|'l'} [props.size='s'] - Size scale of the button.
 * @param {string} [props.className=''] - Additional custom CSS class names.
 * @param {boolean} [props.circle=false] - If true, renders a circular button for icons.
 * @param {string} [props.href=''] - If provided, renders an <a> link instead of a <button>.
 * @returns {JSX.Element} The rendered button or anchor element.
 */
const Button = ({
  children,
  variant = "primary",
  size = "s",
  className = "",
  circle = false,
  href = "",
  ...props
}) => {
  // Composes BEM-like CSS classes dynamically based on props
  const buttonClasses = `
    ${styles.button}
    ${styles[`variant-${variant}`]}
    ${styles[`size-${size}`]}
    ${circle ? styles.circle : ''}
    ${className}
  `.trim();

  // Render as anchor tag if destination URL is specified
  if (href) {
    return (
      <a href={href} className={buttonClasses} {...props}>
        {children}
      </a>
    )
  }

  // Otherwise render as standard accessible button
  return (
    <button type="button" className={buttonClasses} {...props}>
      {children}
    </button>
  )
}

export default Button