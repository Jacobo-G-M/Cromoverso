// React core hooks
import { useState } from 'react';

// Reusable UI components
import Button from '../ui/Button/Button';
import Dropdown from '../ui/Dropdown/Dropdown';
import Switch from '../ui/Switch/Switch';
import PillSwitch from '../ui/PillSwitch/PillSwitch';

// SVG Icons imported as React components
import AccesibilidadIcon from '../../assets/icons/accesibilidad.svg?react'
import LogoNormalIcon from '../../assets/logo/logo-normal.svg?react'
import LogoInversoIcon from '../../assets/logo/logo-inverso.svg?react';
import MenuIcon from '../../assets/icons/menu.svg?react'
import CerrarIcon from '../../assets/icons/cerrar.svg?react'

// Component styles and child mobile navigation menu
import styles from './Navbar.module.css'
import MobileMenu from './MobileMenu';

// Allowed navigation link paths
const LINKS_TITLES = {
  inicio: "/inicio",
  mundos: "/mundos",
}


/**
 * Global Navigation Bar Component
 *
 * Provides:
 * - Brand logo with theme-aware variants (desktop vs. mobile)
 * - Main navigation links with active view indicator
 * - Accessibility controls panel (desktop dropdown and mobile bottom sheet)
 * - Language switcher pill ('ES' / 'EN')
 * - Authentication CTAs ('Ingresar' / 'Crear cuenta')
 * - Mobile hamburger menu toggle
 *
 * @param {Object} props
 * @param {Object} props.texts - Localized texts dictionary.
 * @param {string} props.language - Active language code ('es' or 'en').
 * @param {Function} props.changeLanguage - Callback to update global language.
 * @param {Function} props.onNavigate - Callback for internal view switching.
 * @param {string} props.currentView - Identifier of the active route view.
 * @returns {JSX.Element} The rendered Navbar component.
 */
const Navbar = ({ texts, language, changeLanguage, onNavigate, currentView }) => {
  // State to toggle the full-screen mobile navigation drawer
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State to toggle the accessibility panel (dropdown on desktop, bottom sheet on mobile)
  const [isMenuAccesibilityOpen, setIsMenuAccesibilityOpen] = useState(false);

  // Text size preference state ('Normal', 'Grande', etc.)
  const [textSize, setTextSize] = useState('Normal');

  // Stores active accessibility toggles as key-boolean pairs (e.g. { altoContraste: true })
  const [accesibilityToggles, setAccesibilityToggles] = useState({});


  /**
   * Resets all accessibility toggles and restores default text size.
   */
  const handleResetAccesibility = () => {
    setAccesibilityToggles({});
    setTextSize('Normal')
  }

  // Localized texts for navbar links and accessibility panel
  const nav = texts?.navbar;
  const accesibility = texts?.accesibilidad;

  // Formats accessibility options into a structured array of { key, title, help }
  const accesibilityHelp = Object.entries(accesibility ?? {})
    .filter(([key, item]) => item?.titulo && item?.ayuda)
    .map(([key, item]) => {
      return { key, title: item.titulo, help: item.ayuda }
    })
  
  // Filters navigation links defined in API against whitelist in LINKS_TITLES
  const links = Object.entries(nav?.enlaces ?? {}).filter(([key]) => LINKS_TITLES[key])
  
  // Reusable accessibility panel JSX rendered both in desktop Dropdown and mobile sheet
  const accessibilityPanel = (
    <section className={styles.accesibility}>
      <div className={styles.accesibilityTitle}>
        <h3 className="heading-h3">{accesibility?.titulo}</h3>
        <Button circle={true} variant='ghost' size='m' onClick={() => setIsMenuAccesibilityOpen(false)}>
          <CerrarIcon />
        </Button>
      </div>
      {/* Text size selector using PillSwitch */}
      <div className={styles.accesibilityTextSize}>
        <p className='body-m-bold'>{accesibility?.tamanoTexto?.titulo}</p>
        <PillSwitch
          options={Object.values(accesibility?.tamanoTexto?.opciones ?? {})}
          value={textSize}
          onChange={setTextSize}
          shapeButton='rounded'
          border={false}
          fullWidth={true}
        />
      </div>
      {/* Accessibility options list with individual interactive toggle switches */}
      <div className={styles.accesibilityOptions}>
        {accesibility && (
          accesibilityHelp.map((item, index) => (
            <div key={index} className={styles.accesibilityRow}>
              <div className={styles.accesibilityOptionLeft}>
                <p className={'body-m-bold'}>{item.title}</p>
                <p className={'body-s'} style={{ color: 'var(--text-secondary)' }}>{item.help}</p>
              </div>
              <div>
                <Switch
                  checked={!!accesibilityToggles[item.key]}
                  onChange={(isChecked) => {
                    setAccesibilityToggles(prev => ({
                      ...prev,
                      [item.key]: isChecked
                    }))
                  }}
                />
              </div>
            </div>
          ))
        )}

      {/* Footer with accessibility declaration link and reset preferences button */}
      </div>
      <div className={styles.accesibilityRestart}>
        <p
          className={'body-s-bold'}
          style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}
        >
          {accesibility?.enlaces?.declaracion}
        </p>
        <Button
          variant='secondary'
          onClick={handleResetAccesibility}
          className={styles.resetButton}
        >
          {accesibility?.botones?.restablecer}
        </Button>
      </div>
    </section>
  );

  return (
    // Navbar
    <header className={styles.navbar}>
      {/* Left section: Brand logo and desktop navigation links */}
      <nav className={styles.navLeft}>
        {/* Brand logo anchor with client-side navigation */}
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('inicio'); }}>
          <span className={styles.desktopOnly}>
            <LogoNormalIcon />
          </span>
          <span className={styles.mobileOnly}>
            <LogoInversoIcon />
          </span>
        </a>
        {/* Desktop navigation links */}
        {nav && (
          <>
            <div className={`${styles.desktopOnly} ${styles.buttonsLink}`}>
              {
                links.map(([key, tag]) => (
                  <Button
                    className={currentView === key ? styles.activeLink : ''}
                    key={key}
                    variant='ghost'
                    size='s'
                    href={`/${key}`}
                    onClick={(e) => { e.preventDefault(); onNavigate(key) }}
                  >
                    {tag}
                  </Button>
                ))
              }
            </div>
          </>
        )}
      </nav>
      {/* Right section: Accessibility, language switcher, auth buttons, mobile menu trigger */}
      <nav className={styles.navRight}>
        <div className={styles.desktopOnly}>
          {/* Desktop Accessibility Dropdown trigger */}
          <div className={styles.desktopOnly}>
            <Dropdown
              isOpen={isMenuAccesibilityOpen}
              onClose={() => setIsMenuAccesibilityOpen(false)}
              trigger={
                <Button variant='secondary' size='s' circle={true} onClick={() => setIsMenuAccesibilityOpen(!isMenuAccesibilityOpen)}>
                  <AccesibilidadIcon />
                </Button>}
            >
              {accessibilityPanel}
            </Dropdown>
          </div>
        </div>
        {/* Desktop Language Switcher (ES / EN) */}
        <div className={styles.desktopOnly}>
          <PillSwitch
            options={['ES', 'EN']}
            value={language?.toUpperCase()}
            onChange={(newLang) => changeLanguage(newLang.toLowerCase())}
          />
        </div>

        {/* Login CTA button */}
        <Button variant='secondary' size='s' onClick={(e) => { e.preventDefault(); onNavigate('iniciar-sesion'); }}>
          {nav?.botones?.ingresar ?? 'Ingresar'}
        </Button>
        {/* Desktop Sign Up CTA button */}
        <div className={styles.desktopOnly}>
          <Button size='s' onClick={(e) => { e.preventDefault(); onNavigate('crear-cuenta'); }}>
            {nav?.botones?.crearCuenta ?? "Crear cuenta"}
          </Button>
        </div>
        {/* Mobile hamburger menu toggle button */}
        <div className={styles.mobileOnly}>
          <Button
            variant='secondary'
            size='s'
            circle={true}
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon />
          </Button>
        </div>
      </nav>
      {/* Fullscreen mobile navigation overlay drawer */}
      <MobileMenu
        texts={texts?.menuMovil}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        language={language}
        changeLanguage={changeLanguage}
        onNavigate={onNavigate}
        onOpenAccessibility={() => {
          setIsMenuOpen(false);
          setIsMenuAccesibilityOpen(true);
        }}
      />
      {/* Mobile Accessibility Bottom Sheet Modal */}
      {isMenuAccesibilityOpen && (
        <div 
          className={`${styles.mobileAccessibilityOverlay} ${styles.mobileOnly}`}
          onClick={() => setIsMenuAccesibilityOpen(false)}
        >
          <div 
            className={styles.mobileAccessibilitySheet}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => {e.stopPropagation()}}
          >
            {accessibilityPanel}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar