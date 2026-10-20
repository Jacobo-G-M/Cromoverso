import { useState } from 'react';
import { useTexts } from '../../hooks/useTexts';
import Button from '../ui/Button/Button';
import Input from '../ui/Input/Input';
import Dropdown from '../ui/Dropdown/Dropdown';
import BuscarIcon from '../../assets/icons/buscar.svg?react';
import GloboIcon from '../../assets/icons/globo.svg?react'
import ChevronAbajoIcon from '../../assets/icons/chevronabajo.svg?react'
import AccesibilidadIcon from '../../assets/icons/accesibilidad.svg?react'
import LogoNormalIcon from '../../assets/logo/logo-normal.svg?react'
import MenuIcon from '../../assets/icons/menu.svg?react'
import CheckIcon from '../../assets/icons/check.svg?react'
import styles from './Navbar.module.css'
import MobileMenu from './MobileMenu';

const LINKS_TITLES = {
  album: "/album",
  intercambios: "/intercambios",
  mundos: "/mundos",
  ranking: "/ranking",
  sobres: "/sobres",
}

const Navbar = ({ texts, language, changeLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nav = texts?.navbar;

  const links = Object.entries(nav?.enlaces ?? {}).filter(([key]) => LINKS_TITLES[key])

  return (
    <header className={styles.navbar}>
      <nav className={styles.navLeft}>
        <a href="/">
          <LogoNormalIcon />
        </a>
        {nav && (
          <>
            <div className={styles.desktopOnly}>
              {
                links.map(([key, tag]) => (
                  <Button key={key} variant='ghost' size='s' href={key}>
                    {tag}
                  </Button>
                ))
              }
            </div>
          </>
        )}
      </nav>

      <nav className={styles.navRight}>
        {nav && (
          <div className={styles.desktopOnly} style={{ maxWidth: "400px", flex: 1 }}>
            <Input placeholder={nav?.buscador?.placeholder} icon={<BuscarIcon />} />
          </div>

        )}
        <div className={styles.desktopOnly}>
          <Dropdown
            trigger={<Button variant='secondary' className={styles.select}>
              <GloboIcon />
              {language.toUpperCase()}
              <ChevronAbajoIcon />
            </Button>}
          >
            <div className={styles.language}>
              <span className='detail-label'>Idioma · Language</span>
              <div className={`${styles.languageOption} ${language === "es" ? styles.langSelected : ""}`} onClick={() => changeLanguage('es')}>
                <div>
                  <p className='body-s-bold'>Español</p>
                  <span className='detail-note'>lang="es-CO"</span>
                </div>
                <div className={styles.iconSelect}>
                  {language === "es" && (<CheckIcon />)}
                </div>
              </div>
              <div className={`${styles.languageOption} ${language === "en" ? styles.langSelected : ""}`} onClick={() => changeLanguage('en')}>
                <div>
                  <p className='body-s-bold'>English</p>
                  <span className='detail-note'>lang="en"</span>
                </div>
                <div className={styles.iconSelect}>
                  {language === "en" && (<CheckIcon />)}
                </div>
              </div>
              <span className="detail-note" style={{ padding: "var(--spacing-1)" }}>
                Se recuerda en este dispositivo con una cookie de preferencias
              </span>
            </div>
          </Dropdown>
        </div>
        <div className={styles.desktopOnly}>
          <Button variant='secondary' size='s' circle={true}>
            <AccesibilidadIcon />
          </Button>
        </div>
        {nav && (
          <Button variant='secondary' size='s'>
            {nav?.botones?.ingresar}
          </Button>
        )}
        {nav && (
          <div className={styles.desktopOnly}>
            <Button size='s'>
              {nav?.botones?.crearCuenta}
            </Button>
          </div>
        )}
        <div className={styles.mobileOnly}>
          <Button
            variant='secondary'
            size='s'
            circle={true}
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon />
          </Button>
        </div>
      </nav>
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        language={language}
        changeLanguage={changeLanguage}
      />
    </header>
  )
}

export default Navbar