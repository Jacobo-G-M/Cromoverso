import { useEffect, useId, useRef, useState } from "react";
import styles from "./CookiePreferences.module.css";

import Button from "../ui/Button/Button";
import Switch from "../ui/Switch/Switch";
import { COOKIES_ALL, COOKIES_NECCESSARY_ONLY } from "../../utils/cookies";

export default function CookiePreferences({
  open,
  texts,
  allow,
  onSave,
  onClose,
  error,
}) {
  const dialog = useRef(null);
  const id = useId();
  const [selection, setSelection] = useState(allow ?? {
    necesarias: true,
    preferencias: false,
    analiticas: false,
    marketing: false,
  });

  const handleToggle = (key) => {
    setSelection(prev => ({
      ...prev,
      [key]: !prev?.[key]
    }))
  }

  useEffect(() => {
    if (open) {
      setSelection(allow);
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
              checked={!!selection[key]}
              onChange={() => handleToggle(key)}
            />
          </section>
        );
      })}
      <div className={styles.buttonsGroup}>
        <Button variant="primary" onClick={() => onSave(selection)}>
          {texts?.botones?.guardarSeleccion}
        </Button>
        <Button variant="secondary" onClick={() => onSave(COOKIES_NECCESSARY_ONLY)}>
          {texts?.botones?.rechazarOpcionales}
        </Button>
        <Button variant="primary" onClick={() => onSave(COOKIES_ALL)}>
          {texts?.botones?.aceptarTodas}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {texts?.botones?.cerrarSinGuardar}
        </Button>
      </div>
    </dialog>
  );
}
