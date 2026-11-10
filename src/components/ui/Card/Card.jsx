// React core hook
import React from 'react';

// SVG Icons imported as React components
import CoronaIcon from '../../../assets/icons/corona.svg?react';
import EstrellaIcon from '../../../assets/icons/estrella.svg?react';
import RomboIcon from '../../../assets/icons/rombo.svg?react';
import CirculoIcon from '../../../assets/icons/circulo.svg?react';

// Card character artwork assets imported as React components
import NeonHolographic from '../../../assets/cards/CV-001.svg';
import BosqueHolographic from '../../../assets/cards/CV-041.png';
import CoralHolographic from '../../../assets/cards/CV-081.png';
import NieblaHolographic from '../../../assets/cards/CV-101.png';
import CommonCard from '../../../assets/cards/CV-002.svg';

// Styles
import styles from './Card.module.css';

/**
 * Individual Trading Card Component
 *
 * Features:
 * - 3-digit padded card number badge (e.g., '001', '042').
 * - Rarity symbol icon badge (Legendaria, Épica, Rara, Común).
 * - Special holographic glow effect for Legendary cards.
 * - Optional rotated '¡NUEVO!' pill badge for newly acquired cards.
 * - Dynamic artwork mapping per world and rarity.
 * - Card name and localized metadata subtitle (World + Type).
 *
 * @param {Object} props
 * @param {Object} props.texts - Localized text dictionary.
 * @param {Object} props.card - Card data object (id, numero, nombre, mundo, rareza, tipo, etc.).
 * @param {'s'|'m'|'l'} [props.size='m'] - Size variant of the card.
 * @param {boolean} [props.isNew=false] - Whether to show the '¡NUEVO!' badge.
 * @param {boolean} [props.isPlaceholder=false] - Placeholder slot flag.
 * @param {Function} [props.onClick] - Optional click handler.
 * @returns {JSX.Element} The rendered collectible card.
 */
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

  // Formats card sequence number to three digits (e.g. 1 -> "001")
  const formattedNumber = String(card?.numero ?? '').padStart(3, '0');

  // Lookup map associating card rarity identifiers with their corresponding SVG icon
  const RARITY_ICONS = {
    legendaria: <CoronaIcon />,
    epica: <EstrellaIcon />,
    rara: <RomboIcon />,
    comun: <CirculoIcon />
  }

  // Specific high-resolution artworks for Legendary cards by world
  const CARD_IMAGES = {
    'neon': NeonHolographic,
    'bosque': BosqueHolographic,
    'coral': CoralHolographic,
    'niebla': NieblaHolographic,
  };

  // Determines artwork asset: uses specific artwork for Legendary cards or standard
  const characterSrc = (card?.rareza === 'legendaria' ? CARD_IMAGES[card?.mundo] : CommonCard) ?? NeonHolographic;

  // Interpolates world name and card type into descriptive subtitle (e.g. "Abismo Coral • Héroe")
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
      {/* Optional '¡NUEVO!' badge */}
      {isNew &&
        <span className={styles.newBadge}>
          {size === 's' ? cromoTexts?.estados?.nuevoExclamacion : cromoTexts?.estados?.nuevoExclamacion.toUpperCase() ?? '¡NUEVO!'}
        </span>}
      {/* Visual illustration area with thematic background color per world */}
      <div className={`${styles.artArea} ${styles[`world-${card?.mundo}`]}`}>
        <div className={styles.cardHeader}>
          {/* Top badge overlay: 3-digit card number and rarity symbol */}
          <span className={`detail-note-bold ${styles.numberBadge}`}>
            {formattedNumber}
          </span>
          <span className={`${styles.rarityBadge} ${styles[`rarity-${card?.rareza}`]}`}>
            {RARITY_ICONS[card?.rareza] || <CirculoIcon />}
          </span>
        </div>
        {/* Character illustration image */}
        <img src={characterSrc} alt={card?.nombre} className={styles.characterImage} />
      </div>

      {/* Card text metadata container */}
      <div className={styles.cardInfo}>
        <h4 className={`card-name-${size}`}>
          {card?.nombre}
        </h4>
        {/* Subtitle hidden on compact sizes */}
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