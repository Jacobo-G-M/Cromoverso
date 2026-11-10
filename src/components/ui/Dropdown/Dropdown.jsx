// React core hook
import { useState, useRef, useEffect } from 'react';

// Styles
import styles from './Dropdown.module.css'

/**
 * Reusable Dropdown Menu Component
 *
 * Features:
 * - Controlled or uncontrolled visibility mode.
 * - Click-outside detection to dismiss the menu automatically.
 * - Alignment support ('left' or 'right').
 * - Renders custom children panel or a standard selectable options list.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - Element acting as the toggle trigger (e.g., a Button).
 * @param {Array<string>} [props.options=[]] - List of string options to display if children is omitted.
 * @param {Function} [props.onSelect] - Callback triggered when an option item is clicked.
 * @param {boolean} [props.isOpen] - Optional controlled visibility state.
 * @param {Function} [props.onClose] - Callback when clicking outside in controlled mode.
 * @param {'left'|'right'} [props.align='right'] - Menu alignment relative to trigger.
 * @param {React.ReactNode} [props.children] - Optional custom dropdown content.
 * @returns {JSX.Element} The dropdown container.
 */
const Dropdown = ({
  trigger,
  options = [],
  onSelect,
  isOpen: controlledIsOpen,
  onClose,
  align = "right",
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Determines if visibility is controlled by parent props or internal state
  const isControlled = controlledIsOpen !== undefined;
  const showMenu = isControlled ? controlledIsOpen : isOpen;

  // Click-outside listener to dismiss dropdown menu automatically
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks if the element is currently hidden/invisible in the DOM
      if (dropdownRef.current && dropdownRef.current.offsetParent === null) {
        return;
      }
      
      // Close menu if click target is outside the dropdown container
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isControlled) {
          onClose?.()
        } else {
          setIsOpen(false);
        }
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    };
  }, [showMenu, isControlled, onClose]);

  return (
    <div ref={dropdownRef} className={styles.container}>
      {/* Trigger element container */}
      <div onClick={() => setIsOpen(!isOpen)} className={`${styles.trigger} ${showMenu ? styles.active : ""}`}>
        {trigger}
      </div>
      {/* Dropdown Floating Menu */}
      {showMenu && (
        <div className={`${styles.menu} ${styles[`align-${align}`]}`}>
          {children ? (
            children
          ) : (
            <ul className={styles.defaultList}>
              {options.map((option, index) => (
                <li
                  key={index}
                  className={styles.defaultItem}
                  onClick={() => {
                    onSelect?.(option)
                    setIsOpen(false)
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )
          }
        </div>
      )}
    </div>
  )
}

export default Dropdown