import { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css'

const Dropdown = ({
  trigger,
  options = [],
  onSelect,
  isOpen: controlledIsOpen,
  onClose,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isControlled = controlledIsOpen !== undefined;
  const showMenu = isControlled ? controlledIsOpen : isOpen;

  useEffect(() => {
    const handleClickOutside = (event) => {
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
      <div onClick={() => setIsOpen(!isOpen)} className={`${styles.trigger} ${showMenu ? styles.active : ""}`}>
        {trigger}
      </div>
      {showMenu && (
        <div className={styles.menu}>
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