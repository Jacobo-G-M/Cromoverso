import { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css'

const Dropdown = ({
  trigger,
  options = [],
  onSelect,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={styles.container}>
      <div onClick={() => setIsOpen(!isOpen)} className={`${styles.trigger} ${isOpen ? styles.active : ""}`}>
        {trigger}
      </div>
      {isOpen && (
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