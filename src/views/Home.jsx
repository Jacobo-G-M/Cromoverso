// React core and hooks
import React, { useState } from 'react'
// Custom hooks to fetch localized texts and world catalog data from the API
import { useTexts } from '../hooks/useTexts'
import { useMundos } from '../hooks/useMundos'

// SVG Icons imported as React components
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

// Static graphic asset for the hero card fan showcase
import abanicoCromos from '../assets/cards/abanico-de-cromos.png'

// Component-scoped CSS styles and reusable UI components
import styles from './Home.module.css'
import Button from '../components/ui/Button/Button'
import { Cookies } from '../components/layout/Cookies'

/**
 * Home View Component
 *
 * Serves as the landing page of Cromoverso.
 * Features a Hero section with primary calls-to-action (CTA)
 * and an interactive grid showcasing the six available worlds.
 *
 * @param {Object} props
 * @param {Object} props.texts - Localized copy for the home page sections.
 * @param {Object} [props.cookiesTexts] - Localized copy for cookie notices.
 * @param {Function} props.onNavigate - Callback function to trigger internal view routing.
 * @returns {JSX.Element} The rendered Home page view.
 */
const Home = ({ texts, cookiesTexts, onNavigate }) => {
  // Fetch worlds list, loading state, and error message from API hook
  const { mundos, loading, error } = useMundos();
  // Tracks the currently selected world in the preview grid (defaults to Ciudad Neón)
  const [selectedWorld, setSelectedWorld] = useState({ id: 'neon', nombre: 'Ciudad Neón' })
  // Lookup map associating each world ID with its specific SVG icon component
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
    {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Main headline */}
          <h1 className="heading-display">{texts?.hero?.titulo ?? 'Seis mundos. 120 héroes. Un álbum tuyo.'}</h1>
          {/* Mobile-only subtitle */}
          <p className={`${styles.mobileOnly} body-m`}>
            {texts?.hero?.subtituloMovil}
          </p>
          {/* Primary Action Buttons */}
          <div className={styles.heroButtons}>
            {/* Primary CTA: Navigate to register / create account view */}
            <Button
              variant='accent'
              size='l'
              className='body-m-bold'
              onClick={(e) => {
                e.preventDefault();
                onNavigate('crear-cuenta', selectedWorld.id)
              }}
            >
              <span className={styles.desktopOnly}>
                <RegaloIcon />
              </span>
              {texts?.hero?.botones?.crearCuentaGratis ?? 'Crear cuenta gratis'}
            </Button>
            {/* Secondary CTA: Navigate directly to the worlds catalog */}
            <Button
              href='/mundos'
              variant='secondary'
              size='l'
              className='body-m-bold'
              onClick={(e) => {
                e.preventDefault();
                onNavigate('mundos', selectedWorld.id)
              }}
            >
              <span className={styles.desktopOnly}>
                <AlbumIcon />
              </span>

              {texts?.hero?.botones?.explorarMundos ?? 'Explorar los mundos'}
            </Button>
          </div>
          {/* Desktop-only secondary note with sparkle icon */}
          <div className={`${styles.heroNote} ${styles.desktopOnly}`}>
            <DestellosIcon />
            <p className='body-s'>
              {texts?.hero?.subtitulo}
            </p>
          </div>
        </div>
        {/* Hero Visual Area: Floating card fan showcase with holographic badge */}
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
      {/* Worlds section */}
      <section className={styles.worlds}>
        <div className={styles.worldsHeader}>
          <div className={styles.worldsHeaderDescription}>
            <h2 className="heading-h2">
              {texts?.mundos?.titulo}
            </h2>
            <p className="body-s">{texts?.mundos?.subtitulo}</p>
          </div>
          {/* Dynamic navigation button pointing to the currently active world */}
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
        {/* Interactive world cards grid */}
        <div className={styles.worldsCards}>
          {mundos?.map((mundo, index) => {
            // Retrieve matching SVG icon by world identifier
            const Icon = WORLD_ICONS[mundo.id]

            return (
              <div
                key={mundo.id}
                className={`${styles.worldCard} ${styles[`world-${mundo.id}`]}`}
                // Selects this world on click, updating the dynamic CTA link above
                onClick={() => setSelectedWorld({ id: mundo.id, nombre: mundo.nombre })}
              >
                <div className={styles.cardTop}>
                  <div className={styles.worldIcon}>{Icon}</div>
                   {/* Visual pill badge displaying the world number (#1 to #6) when selected */}
                  {selectedWorld.nombre === mundo.nombre && (
                    <p className={`${styles.worldBadge} detail-note-bold`}>
                      {texts?.mundos?.etiquetas?.mundo?.replace('{numero}', index + 1)}
                    </p>
                  )}
                </div>
                {/* World name and card collection count */}
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