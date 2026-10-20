import { useState } from 'react';
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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [langSelect, setLangSelect] = useState('ES')

  return (
    <header className={styles.navbar}>
      <div className={styles.navLeft}>
        <LogoNormalIcon />
        <div className={styles.desktopOnly}>
          <Button variant='ghost' size='s'>
            Álbum
          </Button>
        </div>
      </div>

      <div className={styles.navRight}>
        <div className={styles.desktopOnly} style={{ maxWidth: "400px", flex: 1 }}>
          <Input placeholder="Busca un héroe o un número" icon={<BuscarIcon />} />
        </div>
        <div className={styles.desktopOnly}>
          <Dropdown
            trigger={<Button variant='secondary' className={styles.select}>
              <GloboIcon />
              {langSelect}
              <ChevronAbajoIcon />
            </Button>}
          >
            <div className={styles.language}>
              <span className='detail-label'>Idioma · Language</span>
              <div className={`${styles.languageOption} ${langSelect === "ES" ? styles.langSelected : ""}`} onClick={() => setLangSelect('ES')}>
                <div>
                  <p className='body-s-bold'>Español</p>
                  <span className='detail-note'>lang="es-CO"</span>
                </div>
                <div className={styles.iconSelect}>
                  {langSelect === "ES" && (<CheckIcon />)}
                </div>
              </div>
              <div className={`${styles.languageOption} ${langSelect === "EN" ? styles.langSelected : ""}`} onClick={() => setLangSelect('EN')}>
                <div>
                  <p className='body-s-bold'>English</p>
                  <span className='detail-note'>lang="en"</span>
                </div>
                <div className={styles.iconSelect}>
                  {langSelect === "EN" && (<CheckIcon />)}
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
        <Button variant='secondary' size='s'>
          Ingresar
        </Button>
        <div className={styles.desktopOnly}>
          <Button size='s'>
            Crear cuenta
          </Button>
        </div>
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
      </div>
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  )
}

export default Navbar