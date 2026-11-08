import React, { useState } from 'react'
import ChevronDerIcon from '../assets/icons/chevronder.svg?react'
import { useMundos } from '../hooks/useMundos'
import CoronaIcon from '../assets/icons/corona.svg?react'
import EstrellaIcon from '../assets/icons/estrella.svg?react'
import RomboIcon from '../assets/icons/rombo.svg?react'
import CirculoIcon from '../assets/icons/circulo.svg?react'
import ChevronAbajoIcon from '../assets/icons/chevronabajo.svg?react'

import styles from './Worlds.module.css'

import Dropdown from '../components/ui/Dropdown/Dropdown'
import Button from '../components/ui/Button/Button'
import { CardsGrid } from '../components/ui/CardsGrid/CardsGrid'

const WORLD_ORDER = ['neon', 'coral', 'bosque', 'forja', 'orbita', 'niebla'];
const RARITY_FILTERS = [
  { id: 'legendaria', label: 'LEGENDARIA', Icon: CoronaIcon },
  { id: 'epica', label: 'ÉPICA', Icon: EstrellaIcon },
  { id: 'rara', label: 'RARA', Icon: RomboIcon },
  { id: 'comun', label: 'COMÚN', Icon: CirculoIcon },
];

const Worlds = ({ texts, onNavigate }) => {
  const albumTexts = texts?.paginas?.albumMundo;
  const cromoTexts = texts?.components?.cromo;
  const sortOptionsDesktop = Object.values(albumTexts?.orden?.opciones ?? {})
    .map(item => item[0].toUpperCase() + item.slice(1));

  // useState for current world. Default value: neon.
  const [currentWorld, setCurrentWorld] = useState('neon');
  // useState for sort menu button.
  const [isSortMenuActive, setIsSortMenuActive] = useState(false);
  //
  const [sortOption, setSortOption] = useState(sortOptionsDesktop[0]);
  // useState for the selected rarity filter
  const [selectedRarity, setSelectedRarity] = useState(null);
  // useState for the selected rarity filter
  const [selectedType, setSelectedType] = useState(null);
  // Get the current world
  const { mundos: world } = useMundos(currentWorld);
  // Get all the worlds
  const { mundos: worlds } = useMundos();
  const displayedCards = world?.cromos?.filter((c) => {
    const matchesRarity = selectedRarity ? c.rareza === selectedRarity : true;
    const matchesType = selectedType ? c.tipo === selectedType : true;
    return matchesRarity && matchesType;
  });

  const TYPE_FILTERS = [
    { type: 'heroe', title: 'Héroe', quantity: world?.cromos?.reduce((q, current) => current.tipo === 'heroe' ? q + 1 : q, 0) },
    { type: 'aliado', title: 'Aliado', quantity: world?.cromos?.reduce((q, current) => current.tipo === 'aliado' ? q + 1 : q, 0) },
    { type: 'villano', title: 'Villano', quantity: world?.cromos?.reduce((q, current) => current.tipo === 'villano' ? q + 1 : q, 0) },
  ]

  // Text for banner. Describes the number of the current world and range of world's cards
  const headerText = albumTexts?.encabezado?.rango
    ?.replace('{numero}', WORLD_ORDER.indexOf(currentWorld) + 1)
    .replace('{desde}',
      String(world?.numeros?.desde ?? '').padStart(3, '0')
    )
    .replace('{hasta}',
      String(world?.numeros?.hasta ?? '').padStart(3, '0')
    );
  return (
    <>
      {/* Banner */}
      <div className={styles.worldsBanner}>
        <span className={`${styles.breadcrumb} body-s`}>
          <p className='body-s-bold'>{albumTexts?.migas?.inicio}</p>
          <ChevronDerIcon />
          <p>{world?.nombre}</p>
        </span>
        <h1 className="heading-display">{world?.nombre}</h1>
        <span className={`${styles['header-text']} body-l`}>{headerText}</span>
      </div>
      {/* Container to show the content of this view */}
      <div className={styles.worldContent}>
        <div className={styles.worldsFilters}>
          <div className={styles.filterWorlds}>
            <h3 className="heading-h4">{albumTexts?.mundos?.titulo ?? 'Mundos'}</h3>
            {worlds?.map((w) => {
              return (
                <div
                  key={w?.id}
                  className={`
                  ${styles.filterWorld} 
                  ${currentWorld === w.id ? `${styles.isCurrentWorld}` : ''}
                  `}
                  onClick={() => setCurrentWorld(w.id)}
                  style={{ borderColor: `${w?.color}` }}
                >
                  <span className={styles.textWorldDescription}>
                    <span className={styles.textWorld}>
                      <span className={styles.circleWorld} style={{ backgroundColor: `${w?.color}` }}></span>
                      <p className={`${w?.id === currentWorld ? 'body-s-bold' : 'body-s'}`} style={{ color: 'var(--text-primary)' }}>{w?.nombre}</p>
                    </span>
                    <p className="body-s-bold" style={
                      { color: `${w?.id === currentWorld ? `${w?.color}` : 'var(--text-secondary)'}` }}
                    >
                      {albumTexts?.mundos?.cromos?.replace('{cantidad}', w?.totalCromos) ?? `${w?.totalCromos} cromos`}
                    </p>
                  </span>
                  {currentWorld === w.id &&
                    <p
                      className='detail-note-bold' style={{ color: `${w?.color}` }}
                    >
                      {albumTexts?.mundos?.aria?.paginaActual ?? 'Página actual'}
                    </p>
                  }
                </div>
              )
            })}
          </div>
          <div className={styles.rarityFilter}>
            <h3 className="heading-h4">{albumTexts?.filtros?.rareza?.titulo ?? 'Filtrar por rareza'}</h3>
            <div className={styles.rarityList}>
              {RARITY_FILTERS.map(({ id, label, Icon }) => (
                <div
                  key={id}
                  className={`
                    ${styles.rarityRow} 
                    ${selectedRarity === id ? styles.isActive : ''}
                  `}
                  onClick={() => setSelectedRarity(selectedRarity === id ? null : id)}
                >
                  <span
                    className={`${styles.rarityBadge}
                    ${styles[`badge-${id}`]}
                    `}
                  >
                    <Icon />
                    <span className="detail-label">
                      {label}
                    </span>
                  </span>
                  <span className="body-s" style={{ color: 'var(--text-secondary)' }}>{
                    (world?.porRareza?.[id] ?? 0) > 1
                      ? albumTexts?.filtros?.cantidad?.otro?.replace('{cantidad}', world?.porRareza?.[id] ?? 0)
                      : albumTexts?.filtros?.cantidad?.uno?.replace('{cantidad}', world?.porRareza?.[id] ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.typeFilter}>
            <h3 className="heading-h4">{albumTexts?.filtros?.tipo?.titulo ?? 'Filtrar por tipo'}</h3>
            {TYPE_FILTERS.map(({ type, title, quantity }) => (
              <span
                key={type}
                className={`
                  ${styles.type} 
                  ${selectedType === type ? styles.isActive : ''}
                `}
                onClick={() => setSelectedType(selectedType === type ? null : type)}>
                <p className="body-s-bold">{albumTexts?.filtros?.tipo?.opciones?.[type] ?? title}</p>
                <p className="body-s">
                  {
                    quantity > 1
                      ? albumTexts?.filtros?.cantidad?.otro?.replace('{cantidad}', quantity)
                      : albumTexts?.filtros?.cantidad?.uno?.replace('{cantidad}', quantity)
                  }
                </p>
              </span>
            ))}
          </div>
        </div>
        <div className={styles.worldsCardsContainer}>
          <div className={styles.dropdownFilter}>
            <Dropdown
              trigger={
                <Button variant='secondary' size='s' onClick={() => setIsSortMenuActive(!isSortMenuActive)}>
                  {albumTexts?.orden?.etiqueta?.replace('{orden}', sortOption.toLowerCase())}
                  <ChevronAbajoIcon />
                </Button>
              }
              options={sortOptionsDesktop}
            />
          </div>
          <CardsGrid texts={texts} cards={displayedCards} />
        </div>
      </div>
    </>
  )
}

export default Worlds
