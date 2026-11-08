import React, { useState } from 'react'
import ChevronDerIcon from '../assets/icons/chevronder.svg?react'
import { useMundos } from '../hooks/useMundos'

import styles from './Worlds.module.css'

const WORLD_ORDER = ['neon', 'coral', 'bosque', 'forja', 'orbita', 'niebla'];

const Worlds = ({ texts, onNavigate }) => {
  const [currentWorld, setCurrentWorld] = useState('neon');
  const { mundos: world } = useMundos(currentWorld);
  const headerText = texts?.encabezado?.rango

    ?.replace('{numero}', WORLD_ORDER.indexOf(currentWorld) + 1)
    .replace('{desde}',
      String(world?.numeros?.desde ?? '').padStart(3, '0')
    )
    .replace('{hasta}',
      String(world?.numeros?.hasta ?? '').padStart(3, '0')
    );
  return (
    <>
      <div className={styles.worldsBanner}>
        <span className={`${styles.breadcrumb} body-s`}>
          <p className='body-s-bold'>{texts?.migas?.inicio}</p>
          <ChevronDerIcon />
          <p>{world?.nombre}</p>
        </span>
        <h1 className="heading-display">{world?.nombre}</h1>
        <span className={`${styles['header-text']} body-l`}>{headerText}</span>
      </div>
      <div className={styles.worldContent}>
        <div className={styles.worldsFilters}></div>
        <div className={styles.worldsCardsContainer}></div>
      </div>
    </>
  )
}

export default Worlds
