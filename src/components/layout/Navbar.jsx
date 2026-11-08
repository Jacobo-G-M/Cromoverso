import { useState } from 'react';
import { useTexts } from '../../hooks/useTexts';
import Button from '../ui/Button/Button';
import Input from '../ui/Input/Input';
import Dropdown from '../ui/Dropdown/Dropdown';
import Switch from '../ui/Switch/Switch';
import BuscarIcon from '../../assets/icons/buscar.svg?react';
import GloboIcon from '../../assets/icons/globo.svg?react'
import ChevronAbajoIcon from '../../assets/icons/chevronabajo.svg?react'
import AccesibilidadIcon from '../../assets/icons/accesibilidad.svg?react'
import LogoNormalIcon from '../../assets/logo/logo-normal.svg?react'
import LogoInversoIcon from '../../assets/logo/logo-inverso.svg?react';
import MenuIcon from '../../assets/icons/menu.svg?react'
import CheckIcon from '../../assets/icons/check.svg?react'
import CerrarIcon from '../../assets/icons/cerrar.svg?react'
import styles from './Navbar.module.css'
import MobileMenu from './MobileMenu';
import PillSwitch from '../ui/PillSwitch/PillSwitch';

const LINKS_TITLES = {
  inicio: "/inicio",
  mundos: "/mundos",
}


// Navbar Component
const Navbar = ({ texts, language, changeLanguage, onNavigate, currentView }) => {
  // States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAccesibilityOpen, setIsMenuAccesibilityOpen] = useState(false);
  const [textSize, setTextSize] = useState('Normal');
  const [accesibilityToggles, setAccesibilityToggles] = useState({});


  // Reset accesibility options
  const handleResetAccesibility = () => {
    setAccesibilityToggles({});
    setTextSize('Normal')
  }

  // Get texts from navbar and accesibility
  const nav = texts?.navbar;
  const accesibility = texts?.accesibilidad;
  const accesibilityHelp = Object.entries(accesibility ?? {})
    .filter(([key, item]) => item?.titulo && item?.ayuda)
    .map(([key, item]) => {
      return { key, title: item.titulo, help: item.ayuda }
    })

  const links = Object.entries(nav?.enlaces ?? {}).filter(([key]) => LINKS_TITLES[key])

  const accessibilityPanel = (
    <section className={styles.accesibility}>
      <div className={styles.accesibilityTitle}>
        <h3 className="heading-h3">{accesibility?.titulo}</h3>
        <Button circle={true} variant='ghost' size='m' onClick={() => setIsMenuAccesibilityOpen(false)}>
          <CerrarIcon />
        </Button>
      </div>
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
      {/* / Left component from navbar / */}
      <nav className={styles.navLeft}>
        {/* / Icon / */}
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('inicio'); }}>
          <span className={styles.desktopOnly}>
            <LogoNormalIcon />
          </span>
          <span className={styles.mobileOnly}>
            <LogoInversoIcon />
          </span>
        </a>
        {/* / Links / */}
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
      {/* / Right component from navbar / */}
      <nav className={styles.navRight}>
        <div className={styles.desktopOnly}>
          {/* / Accesibility button and menu / */}
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
        {/* / Language switch / */}
        <div className={styles.desktopOnly}>
          <PillSwitch
            options={['ES', 'EN']}
            value={language?.toUpperCase()}
            onChange={(newLang) => changeLanguage(newLang.toLowerCase())}
          />
        </div>

        {/* / Log in button / */}
        <Button variant='secondary' size='s'>
          {nav?.botones?.ingresar ?? 'Ingresar'}
        </Button>
        {/* / Sign up button / */}
        <div className={styles.desktopOnly}>
          <Button size='s'>
            {nav?.botones?.crearCuenta ?? "Crear cuenta"}
          </Button>
        </div>
        {/* / Mobile menu button / */}
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
      {/* / Mobile menu / */}
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