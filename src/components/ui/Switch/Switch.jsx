// Styles
import styles from './Switch.module.css';

/**
 * Accessible Toggle Switch Component
 *
 * Implements an accessible switch button adhering to WAI-ARIA switch pattern.
 *
 * @param {Object} props
 * @param {boolean} props.checked - Active toggle state.
 * @param {Function} props.onChange - Callback invoked with the toggled boolean value.
 * @returns {JSX.Element} The rendered switch control.
 */
const Switch = ({ checked, onChange }) => {
  return (
    <button 
      type="button" 
      role="switch" 
      aria-checked={checked}
      className={`${styles.track} ${checked ? styles.checked : ''}`}
      onClick={() => onChange?.(!checked)}
    >
      <span className={styles.thumb} />
    </button>
  )
}

export default Switch