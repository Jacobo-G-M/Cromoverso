import React from 'react'
import styles from './PillSwitch.module.css';

const PillSwitch = ({ options = [], value, onChange }) => {
  return (
    <div className={styles.container}>
      {options.map((option, index) => (
        <button
          type="button"
          key={index}
          className={`${styles.option} ${option === value ? styles.active : ''}`}
          onClick={() => onChange?.(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default PillSwitch