// React core hook
import React from 'react'

// Styles
import styles from './PillSwitch.module.css';

/**
 * Segmented Pill Switch Component
 *
 * Displays a group of mutually exclusive pill-shaped options (e.g. ['ES', 'EN']).
 *
 * @param {Object} props
 * @param {Array<string>} [props.options=[]] - List of selectable option strings.
 * @param {string} props.value - Currently selected option value.
 * @param {Function} props.onChange - Callback invoked when an option is selected.
 * @param {'pill'|'rounded'} [props.shapeButton='pill'] - Shape style of individual option buttons.
 * @param {'pill'|'rounded'} [props.shapeContainer='pill'] - Shape style of outer container.
 * @param {boolean} [props.border=true] - Whether to render an outer border.
 * @param {boolean} [props.fullWidth=false] - Whether to expand container to 100% width.
 * @returns {JSX.Element} The rendered segmented pill switch.
 */
const PillSwitch = ({
  options = [],
  value,
  onChange,
  shapeButton = "pill",
  shapeContainer = "pill",
  border = true,
  fullWidth = false }) => {
  return (
    <div className={`
        ${styles.container} 
        ${border ? styles.isBorder : ''} 
        ${styles[shapeContainer]} 
        ${fullWidth ? styles.fullWidth : ''}`}
    >
      {options.map((option, index) => (
        <button
          type="button"
          key={index}
          className={`${styles.option} ${option === value ? styles.active : ''} ${styles[shapeButton]}`}
          onClick={() => onChange?.(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default PillSwitch