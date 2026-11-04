import React from 'react'
import styles from './PillSwitch.module.css';

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