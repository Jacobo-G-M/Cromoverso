// React core hook
import React from 'react'

// Styles
import styles from './Footer.module.css'

// SVG Icons imported as React components
import LogoInverso from '../../assets/logo/logo-inverso.svg?react'

/**
 * Global Application Footer Component
 *
 * Renders:
 * - Brand section with inverted contrast logo and project tagline.
 * - Multi-column navigation links grouped by category (Explora, Tu cuenta, Legal).
 * - Direct interactive anchor to re-open the Cookie Preferences modal dialog.
 * - Bottom copyright note with dynamic current year interpolation.
 *
 * @param {Object} props
 * @param {Object} props.texts - Localized text dictionary for footer copy.
 * @param {Function} [props.onOpenCookies] - Callback to open the cookie preferences modal.
 * @returns {JSX.Element} The rendered Footer element.
 */
const Footer = ({ texts, onOpenCookies }) => {
  // Extracts navigation column categories from the localized text dictionary
  const columns = Object.values(texts?.columnas ?? {});
  return (
    <footer className={styles.footer}>
      {/* Top section: Brand statement and navigation links columns */}
      <div className={styles.footerTop}>
        {/* Brand identity and tagline */}
        <div className={styles.brand}>
          <LogoInverso />
          <p className="body-s">
            {texts?.lema ?? 'Colecciona héroes originales de seis mundos. Explora cada mundo y conoce a sus héroes.'}
          </p>
        </div>
        {/* Dynamic navigation columns grid */}
        <div className={styles.navColumns}>
          {columns.map((item, index) => (
            <div key={index} className={styles.column}>
              <span className="detail-label">{item?.titulo}</span>
              {/* Category links */}
              {Object.values(item?.enlaces).map((link) => (
                <a key={link} href={`/${link.toLowerCase()}`} className="body-s">{link}</a>
              ))}
              {/* Injects the interactive Cookie Preferences modal trigger inside the Legal column */}
              {item?.titulo === texts?.columnas?.legal?.titulo && (
                <a 
                  href="#cookies" 
                  className="body-s" 
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenCookies?.();
                  }}
                >
                  Cookies
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Visual horizontal separator */}
      <hr className={styles.divider} />
      {/* Bottom section: Legal copyright notice with dynamic year */}
      <div className={styles.footerBottom}>
        <p className="detail-note">
          {texts?.legal?.derechos?.replace('{anio}', new Date().getFullYear())}
        </p>
      </div>
    </footer>
  )
}

export default Footer