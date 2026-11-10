// React core hook
import { useState } from 'react'

// SVG Icons imported as React components
import LogoNormalIcon from '../../assets/logo/logo-normal.svg?react'
import CerrarIcon from '../../assets/icons/cerrar.svg?react'
import ChevronDerIcon from '../../assets/icons/chevronder.svg?react'
import InicioIcon from '../../assets/icons/inicio.svg?react'
import AlbumIcon from '../../assets/icons/album.svg?react'
import SobreIcon from '../../assets/icons/sobre.svg?react'
import IntercambioIcon from '../../assets/icons/intercambio.svg?react'
import MundoIcon from '../../assets/icons/mundo.svg?react'
import TrofeoIcon from '../../assets/icons/trofeo.svg?react'
import CartasIcon from '../../assets/icons/cartas.svg?react'
import UsuarioIcon from '../../assets/icons/usuario.svg?react'
import CampanaIcon from '../../assets/icons/campana.svg?react'
import GloboIcon from '../../assets/icons/globo.svg?react'
import AccesibilidadIcon from '../../assets/icons/accesibilidad.svg?react'

// Styles and reusable UI components
import styles from './MobileMenu.module.css'
import Button from '../ui/Button/Button'
import PillSwitch from '../ui/PillSwitch/PillSwitch'


/**
 * Fullscreen Mobile Navigation Drawer Component
 *
 * Renders an overlay drawer on mobile viewports containing:
 * - Brand logo and close button
 * - Navigable list of application views with active route indicators
 * - Language switcher ('ES' / 'EN')
 * - Trigger button to launch the accessibility bottom sheet
 * - Quick action buttons for Authentication (Login / Signup)
 *
 * @param {Object} props
 * @param {Object} props.texts - Localized text dictionary for mobile menu copy.
 * @param {boolean} props.isOpen - Controls visibility of the drawer overlay.
 * @param {Function} props.onClose - Callback to dismiss the drawer.
 * @param {string} props.language - Active language code ('es' or 'en').
 * @param {Function} props.changeLanguage - Callback to update global language state.
 * @param {Function} props.onNavigate - Callback for internal client-side navigation.
 * @param {Function} props.onOpenAccessibility - Callback to open accessibility bottom sheet.
 * @returns {JSX.Element|null} The drawer overlay or null if closed.
 */
const MobileMenu = ({
  texts,
  isOpen,
  onClose,
  language,
  changeLanguage,
  onNavigate,
  onOpenAccessibility
}) => {
  // Do not render anything when the drawer is closed
  if (!isOpen) return null;

  // Reads active route from URL to highlight current location
  const currentView = window.location.pathname.slice(1) || 'inicio';

  // Navigation menu items configuration
  const navItems = [
    { label: 'Inicio', icon: <InicioIcon />, link: 'inicio' },
    // { label: 'Álbum', icon: <AlbumIcon /> },
    // { label: 'Sobres', icon: <SobreIcon /> },
    // { label: 'Intercambios', icon: <IntercambioIcon /> },
    { label: 'Mundos', icon: <MundoIcon />, link: 'mundos', worldId: 'neon' },
    // { label: 'Ranking', icon: <TrofeoIcon /> },
    // { label: 'Mi colección', icon: <CartasIcon /> },
    // { label: 'Perfil y logros', icon: <UsuarioIcon /> },
    // { label: 'Notificaciones', icon: <CampanaIcon /> },
  ]

  return (
    <main className={styles.overlay}>
      {/* Drawer Header: Logo and close action */}
      <header className={styles.header}>
        <LogoNormalIcon />
        <Button variant="secondary" onClick={onClose} circle={true}>
          <CerrarIcon />
        </Button>
      </header>
      {/* Main navigation links list */}
      <nav className={styles.navList}>
        {
          navItems.map((item, index) => (
            <button
              key={index}
              className={`${styles.navItem} body-m-bold`}
              onClick={(e) => {
                e.preventDefault()
                onClose();
                onNavigate(item.link, item.worldId);
              }}
            >
              <div className={styles.itemLeft}>
                {item.icon}
                <span className={styles.itemLabel}>{texts?.enlaces[item.label.toLowerCase()]}</span>
              </div>
              {currentView === item.link ? (
                <span className={styles.current}>
                  <p className="detail-label">{texts?.aria?.estasAqui || 'Estas aquí'}</p>
                </span>
              ) : (
                <ChevronDerIcon className={styles.chevron} />
              )}
            </button>
          ))
        }
      </nav>
      {/* Visual divider line */}
      <hr className={styles.dividerPreferences} />
      {/* Bottom section: Settings, accessibility and authentication */}
      <section className={styles.bottomSection}>
        {/* Language preference selector row */}
        <div className={styles.navItem}>
          <div className={`${styles.itemLeft} body-m-bold`}>
            <GloboIcon />
            {texts?.secciones?.idioma ?? 'Idioma'}
          </div>
          <PillSwitch
            options={['ES', 'EN']}
            value={language?.toUpperCase()}
            onChange={(newLang) => changeLanguage(newLang.toLowerCase())}
          />
        </div>
        {/* Accessibility bottom sheet trigger row */}
        <div className={styles.navItem} onClick={onClose}>
          <div className={`${styles.itemLeft} body-m-bold`}>
            {texts?.secciones?.accesibilidad ?? 'Accesibilidad'}
          </div>
          <Button variant='secondary' size='s' circle={true} onClick={onOpenAccessibility}>
            <AccesibilidadIcon />
          </Button>
        </div>
        {/* Visual divider line */}
        <hr className={styles.dividerAccount} />
        {/* Authentication CTA buttons */}
        <div className={styles.account}>
          <Button variant='secondary' size='m'>
            {texts?.botones?.ingresar ?? 'Ingresar'}
          </Button>
          <Button size='m'>
            {texts?.botones?.crearCuenta ?? 'Crear cuenta'}
          </Button>
        </div>
      </section>

    </main>
  )
}

export default MobileMenu