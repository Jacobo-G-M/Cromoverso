import { useState } from 'react'
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
import styles from './MobileMenu.module.css'
import Button from '../ui/Button/Button'
import PillSwitch from '../ui/PillSwitch/PillSwitch'

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [optionLanguage, setOptionLanguage] = useState('ES')

  const navItems = [
    { label: 'Inicio', icon: <InicioIcon /> },
    { label: 'Álbum', icon: <AlbumIcon /> },
    { label: 'Sobres', icon: <SobreIcon /> },
    { label: 'Intercambios', icon: <IntercambioIcon /> },
    { label: 'Mundos', icon: <MundoIcon /> },
    { label: 'Ranking', icon: <TrofeoIcon /> },
    // { label: 'Mi colección', icon: <CartasIcon /> },
    // { label: 'Perfil y logros', icon: <UsuarioIcon /> },
    // { label: 'Notificaciones', icon: <CampanaIcon /> },
  ]

  return (
    <main className={styles.overlay}>
      <header className={styles.header}>
        <LogoNormalIcon />
        <Button variant="secondary" onClick={onClose} circle={true}>
          <CerrarIcon />
        </Button>
      </header>
      <nav className={styles.navList}>
        {
          navItems.map((item, index) => (
            <button
              key={index}
              className={`${styles.navItem} body-m-bold`}
              onClick={onClose}
            >
              <div className={styles.itemLeft}>
                {item.icon}
                <span className={styles.itemLabel}>{item.label}</span>
              </div>
              <ChevronDerIcon className={styles.chevron} />
            </button>
          ))
        }
      </nav>
      <hr className={styles.dividerPreferences} />
      <section className={styles.bottomSection}>
        <div className={styles.navItem}>
          <div className={`${styles.itemLeft} body-m-bold`}>
            <GloboIcon />
            Idioma
          </div>
          <PillSwitch options={['ES', 'EN']} value={optionLanguage} onChange={setOptionLanguage}/>
        </div>
        <button className={styles.navItem} onClick={onClose}>
          <div className={`${styles.itemLeft} body-m-bold`}>
            <AccesibilidadIcon />
            Accesibilidad
          </div>
          <ChevronDerIcon className={styles.chevron} />
        </button>
        <hr className={styles.dividerAccount} />
        <div className={styles.account}>
          <Button variant='secondary' size='m'>
            Ingresar
          </Button>
          <Button size='m'>
            Crear cuenta
          </Button>
        </div>
      </section>

    </main>
  )
}

export default MobileMenu