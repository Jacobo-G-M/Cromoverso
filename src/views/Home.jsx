import React, { useState } from 'react'
import { useTexts } from '../hooks/useTexts'
import { useMundos } from '../hooks/useMundos'

import RegaloIcon from '../assets/icons/regalo.svg?react'
import AlbumIcon from '../assets/icons/album.svg?react'
import DestellosIcon from '../assets/icons/destellos.svg?react'
import FlechaDerIcon from '../assets/icons/flechader.svg?react'
import NeonIcon from '../assets/icons/neon.svg?react'
import CoralIcon from '../assets/icons/coral.svg?react'
import BosqueIcon from '../assets/icons/bosque.svg?react'
import ForjaIcon from '../assets/icons/forja.svg?react'
import OrbitaIcon from '../assets/icons/orbita.svg?react'
import NieblaIcon from '../assets/icons/niebla.svg?react'

import abanicoCromos from '../assets/cards/abanico-de-cromos.png'

import styles from './Home.module.css'
import Button from '../components/ui/Button/Button'

const Home = ({ texts, onNavigate }) => {
  const { mundos, loading, error } = useMundos();
  const [selectedWorld, setSelectedWorld] = useState({id: 'neon', nombre: 'Ciudad Neón'})


  const WORLD_ICONS = {
    neon: <NeonIcon />,
    coral: <CoralIcon />,
    bosque: <BosqueIcon />,
    forja: <ForjaIcon />,
    orbita: <OrbitaIcon />,
    niebla: <NieblaIcon />,
  };

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className="heading-display">{texts?.hero?.titulo ?? 'Seis mundos. 120 héroes. Un álbum tuyo.'}</h1>
          <p className={`${styles.mobileOnly} body-m`}>
            {texts?.hero?.subtituloMovil}
          </p>
          <div className={styles.heroButtons}>
            <Button variant='accent' size='l' className='body-m-bold'>
              <span className={styles.desktopOnly}>
                <RegaloIcon />
              </span>
              {texts?.hero?.botones?.crearCuentaGratis ?? 'Crear cuenta gratis'}
            </Button>
            <Button variant='secondary' size='l' className='body-m-bold'>
              <span className={styles.desktopOnly}>
                <AlbumIcon />
              </span>

              {texts?.hero?.botones?.explorarMundos ?? 'Explorar los mundos'}
            </Button>
          </div>
          <div className={`${styles.heroNote} ${styles.desktopOnly}`}>
            <DestellosIcon />
            <p className='body-s'>
              {texts?.hero?.subtitulo}
            </p>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.guardianBadge}>
            <DestellosIcon />
            <span className="detail-label">
              {texts?.hero?.etiquetas?.guardiana ?? 'Guardiana holográfica'}
            </span>
          </div>
          <img
            src={abanicoCromos}
            alt="Abanico de cromos"
            className={styles.heroCardsImage}
          />
        </div>
      </section>
      <section className={styles.worlds}>
        <div className={styles.worldsHeader}>
          <div className={styles.worldsHeaderDescription}>
            <h2 className="heading-h2">
              {texts?.mundos?.titulo}
            </h2>
            <p className="body-s">{texts?.mundos?.subtitulo}</p>
          </div>
          <Button 
            href='/mundos' 
            variant='ghost'
            onClick={(e) => {
              e.preventDefault();
              onNavigate('mundos', selectedWorld.id)
            }}
          >
            <FlechaDerIcon />
            {texts?.mundos?.enlaces?.ver?.replace('{mundo}', selectedWorld.nombre)}
          </Button>
        </div>
        <div className={styles.worldsCards}>
          {mundos?.map((mundo, index) => {
            const Icon = WORLD_ICONS[mundo.id]

            return (
              <div
                key={mundo.id}
                className={`${styles.worldCard} ${styles[`world-${mundo.id}`]}`}
                onClick={() => setSelectedWorld({ id: mundo.id, nombre: mundo.nombre })}
              >
                <div className={styles.cardTop}>
                  <div className={styles.worldIcon}>{Icon}</div>
                  {selectedWorld === mundo.nombre && (
                    <p className={`${styles.worldBadge} detail-note-bold`}>
                      {texts?.mundos?.etiquetas?.mundo?.replace('{numero}', index + 1)}
                    </p>
                  )}
                </div>
                <h4 className={`${styles['detail-label']} heading-h4`}>{mundo.nombre}</h4>
                <p className="body-s">
                  {
                    texts?.mundos?.etiquetas?.cromos?.replace('{cantidad}', mundo?.totalCromos)
                  }
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default Home