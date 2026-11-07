import React from 'react';

import CoronaIcon from '../../../assets/icons/corona.svg?react';
import EstrellaIcon from '../../../assets/icons/estrella.svg?react';
import RomboIcon from '../../../assets/icons/rombo.svg?react';
import CirculoIcon from '../../../assets/icons/circulo.svg?react';

import NeonHolographic from '../../../assets/cards/CV-001.png';
import BosqueHolographic from '../../../assets/cards/CV-041.png';
import CoralHolographic from '../../../assets/cards/CV-081.png';
import NieblaHolographic from '../../../assets/cards/CV-101.png';
import CommonCard from '../../../assets/cards/CV-002.png';

import styles from './Card.module.css';

const Card = ({
  texts,
  cromo,
  size = 'm',
  isNew = false,
  isPlaceholder = false,
  onClick
}) => {
  const formattedNumber = String(cromo?.numero ?? '').padStart(3, '0');

  const RARITY_ICONS = {
    legendaria: <CoronaIcon />,
    epica: <EstrellaIcon />,
    rara: <RomboIcon />,
    comun: <CirculoIcon />
  }

  const CARD_IMAGES = {
  'neon': NeonHolographic,
  'bosque': BosqueHolographic,
  'coral': CoralHolographic,
  'niebla': NieblaHolographic,
};

  const characterSrc = CARD_IMAGES[cromo?.mundo] || (cromo?.rareza === 'legendaria' ? CARD_IMAGES['neon'] : CommonCard);

  return (
    <article 
      className={`
        ${styles.card} 
        ${styles[`size-${size}`]}
        ${cromo?.holografico || cromo?.rareza === 'legendaria' ? styles.holographic : ''}
      `} 
      onClick={onClick}
    >
      {isNew && 
      <span className={styles.newBadge}>
        {size === 's' ? texts?.estados?.nuevoExclamacion : texts?.estados?.nuevoExclamacion.toUpperCase() ?? '¡NUEVO!'}
      </span>}
      
      <div className={`${styles.artArea} ${styles[`world-${cromo?.mundo}`]}`}>
        <div className={styles.cardHeader}>
          <span className={styles.numberBadge}>
            {formattedNumber}
          </span>
          <span className={`${styles.rarityBadge} ${styles[`rarity-${cromo?.rareza}`]}`}>
            {RARITY_ICONS[cromo?.rareza] || <CirculoIcon />}
          </span>
        </div>
        <img src={characterSrc} alt={cromo?.nombre} className={styles.characterImage} />
      </div>

      <div className={styles.cardInfo}>
        <h4 className={`card-name-${size}`}>
          {cromo?.nombre}
        </h4>
        {size !== 's' && (
          <p className="detail-note">
            {cromo?.mundoNombre} • {cromo?.tipo}
          </p>
        )}
      </div>
    </article>
  )
}

export default Card