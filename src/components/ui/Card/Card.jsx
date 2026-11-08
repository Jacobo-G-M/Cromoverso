import React from 'react';

import CoronaIcon from '../../../assets/icons/corona.svg?react';
import EstrellaIcon from '../../../assets/icons/estrella.svg?react';
import RomboIcon from '../../../assets/icons/rombo.svg?react';
import CirculoIcon from '../../../assets/icons/circulo.svg?react';

import NeonHolographic from '../../../assets/cards/CV-001.svg';
import BosqueHolographic from '../../../assets/cards/CV-041.png';
import CoralHolographic from '../../../assets/cards/CV-081.png';
import NieblaHolographic from '../../../assets/cards/CV-101.png';
import CommonCard from '../../../assets/cards/CV-002.svg';

import styles from './Card.module.css';

const Card = ({
  texts,
  card,
  size = 'm',
  isNew = false,
  isPlaceholder = false,
  onClick
}) => {

  const albumTexts = texts?.paginas?.albumMundo;
  const cromoTexts = texts?.components?.cromo;

  const formattedNumber = String(card?.numero ?? '').padStart(3, '0');

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

  const characterSrc = (card?.rareza === 'legendaria' ? CARD_IMAGES[card?.mundo] : CommonCard) ?? NeonHolographic;
  const cardText = albumTexts?.tarjeta?.tipo
    ?.replace('{mundo}', card?.mundoNombre)
    .replace('{tipo}',
      albumTexts?.filtros?.tipo?.opciones[card?.tipo]
    );


  return (
    <article
      className={`
        ${styles.card} 
        ${styles[`size-${size}`]}
        ${card?.holografico || card?.rareza === 'legendaria' ? styles.holographic : ''}
      `}
      onClick={onClick}
    >
      {isNew &&
        <span className={styles.newBadge}>
          {size === 's' ? cromoTexts?.estados?.nuevoExclamacion : cromoTexts?.estados?.nuevoExclamacion.toUpperCase() ?? '¡NUEVO!'}
        </span>}

      <div className={`${styles.artArea} ${styles[`world-${card?.mundo}`]}`}>
        <div className={styles.cardHeader}>
          <span className={`detail-note-bold ${styles.numberBadge}`}>
            {formattedNumber}
          </span>
          <span className={`${styles.rarityBadge} ${styles[`rarity-${card?.rareza}`]}`}>
            {RARITY_ICONS[card?.rareza] || <CirculoIcon />}
          </span>
        </div>
        <img src={characterSrc} alt={card?.nombre} className={styles.characterImage} />
      </div>

      <div className={styles.cardInfo}>
        <h4 className={`card-name-${size}`}>
          {card?.nombre}
        </h4>
        {size !== 's' && (
          <p
            className={`${styles.cardSubtitle} detail-note`}
            style={{ color: 'var(--text-secondary)' }}
          >
            {cardText}
          </p>
        )}
      </div>
    </article>
  )
}

export default Card