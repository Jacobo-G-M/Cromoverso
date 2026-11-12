// React core hook
import { useEffect, useId, useRef, useState } from "react";

// Styles and reusable UI components
import styles from "./CookiePreferences.module.css";
import Button from "../ui/Button/Button";
import Switch from "../ui/Switch/Switch";

import { COOKIES_ALL, COOKIES_NECCESSARY_ONLY } from "../../utils/cookies";

/**
 * Cookie Preferences Modal Dialog Component
 *
 * Implements an accessible HTML5 <dialog> element allowing users to:
 * - Review detailed explanations for each cookie category.
 * - Toggle individual non-essential cookie categories (Preferences, Analytics, Marketing).
 * - Keep strictly necessary cookies permanently active.
 * - Choose between saving custom selection, rejecting optionals, accepting all, or closing without changes.
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal dialog is currently visible.
 * @param {Object} props.texts - Localized copy for preferences dialog and categories.
 * @param {Object} [props.allow] - Currently saved user consent object.
 * @param {Function} props.onSave - Callback when persisting consent selection.
 * @param {Function} props.onClose - Callback to close dialog without saving changes.
 * @param {string} [props.error] - Optional error message display.
 * @returns {JSX.Element} The rendered modal dialog element.
 */
export default function CookiePreferences({
  open,
  texts,
  allow,
  onSave,
  onClose,
  error,
}) {
  // Reference to the <dialog> DOM element
  const dialog = useRef(null);
  // Unique accessible ID for aria-labelledby
  const id = useId();
  // Internal draft state holding user's toggle choices before saving
  const [selection, setSelection] = useState(allow ?? COOKIES_NECCESSARY_ONLY);

  /**
   * Toggles the boolean state of a specific cookie category key.
   *
   * @param {string} key - Category key ('preferencias', 'analiticas', 'marketing').
   */
  const handleToggle = (key) => {
    setSelection(prev => ({
      ...prev,
      [key]: !prev?.[key]
    }))
  }

  // Synchronizes the native <dialog> element open/close state with React props
  useEffect(() => {
    if (open) {
      setSelection(allow ?? COOKIES_NECCESSARY_ONLY);
      if (!dialog.current.open) dialog.current.showModal();
    } else if (dialog.current.open) dialog.current.close();
  }, [open, allow]);
  return (
    <dialog
      className={styles['dialog-preferences']}
      ref={dialog}
      aria-labelledby={id}
      onClose={onClose}
    >
      <div className={styles.header}>
        <h2 id={id} className="heading-h3">{texts?.titulo}</h2>
        <p className="body-s" style={{ color: 'var(--text-secondary)' }}>
          {texts?.texto}
        </p>
      </div>
      <section className={styles.cookieOption}>
        {/* Strictly Necessary Cookies category (always active, non-toggleable) */}
        <div>
          <h3 className="heading-h4">{texts?.categorias?.necesarias?.titulo}</h3>
          <p className="body-s" style={{ color: 'var(--text-secondary)' }}>
            {texts?.categorias?.necesarias?.descripcion}
          </p>
        </div>
        <span className="detail-note-bold" style={{ color: 'var(--brand-primary)' }}>
          {texts?.etiquetas?.siempreActivas}
        </span>
      </section>
      {/* Optional Cookie categories with interactive toggle switches */}
      {['preferencias', 'analiticas', 'marketing'].map((key) => {
        const cat = texts?.categorias?.[key];
        
        return (
          <section key={key} className={styles.cookieOption}>
            <div>
              <h3 className="heading-h4">{cat?.titulo}</h3>
              <p className="body-s" style={{ color: 'var(--text-secondary)' }}>
                {cat?.descripcion}
              </p>
            </div>
            <Switch
              checked={!!selection?.[key]}
              onChange={() => handleToggle(key)}
            />
          </section>
        );
      })}
      {/* Action buttons grid */}
      <div className={styles.buttonsGroup}>
        {/* Save active toggle selection */}
        <Button variant="primary" onClick={() => onSave(selection)}>
          {texts?.botones?.guardarSeleccion}
        </Button>
        {/* Reject all optional categories */}
        <Button variant="secondary" onClick={() => onSave(COOKIES_NECCESSARY_ONLY)}>
          {texts?.botones?.rechazarOpcionales}
        </Button>
        {/* Accept all categories */}
        <Button variant="primary" onClick={() => onSave(COOKIES_ALL)}>
          {texts?.botones?.aceptarTodas}
        </Button>
        {/* Dismiss without saving changes */}
        <Button variant="secondary" onClick={onClose}>
          {texts?.botones?.cerrarSinGuardar}
        </Button>
      </div>
    </dialog>
  );
}
