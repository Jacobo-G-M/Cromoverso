// React core hooks
import { useState, useEffect } from 'react'

// Custom hook to fetch individual world data and complete world catalog
import { useMundos } from '../hooks/useMundos'

// SVG Icons imported as React components
import ChevronDerIcon from '../assets/icons/chevronder.svg?react'
import CoronaIcon from '../assets/icons/corona.svg?react'
import EstrellaIcon from '../assets/icons/estrella.svg?react'
import RomboIcon from '../assets/icons/rombo.svg?react'
import CirculoIcon from '../assets/icons/circulo.svg?react'
import ChevronAbajoIcon from '../assets/icons/chevronabajo.svg?react'
import FlechaIzqIcon from '../assets/icons/flechaizq.svg?react';
import BuscarIcon from '../assets/icons/buscar.svg?react';

// Component-scoped styles
import styles from './Worlds.module.css'
// Reusable UI components
import Dropdown from '../components/ui/Dropdown/Dropdown'
import Button from '../components/ui/Button/Button'
import { CardsGrid } from '../components/ui/CardsGrid/CardsGrid'

// Canonical order of worlds for numbering calculations (1 to 6)
const WORLD_ORDER = ['neon', 'coral', 'bosque', 'forja', 'orbita', 'niebla'];

// Static configuration for card rarity filters with associated icons
const RARITY_FILTERS = [
  { id: 'legendaria', label: 'LEGENDARIA', Icon: CoronaIcon },
  { id: 'epica', label: 'ÉPICA', Icon: EstrellaIcon },
  { id: 'rara', label: 'RARA', Icon: RomboIcon },
  { id: 'comun', label: 'COMÚN', Icon: CirculoIcon },
];

/**
 * Worlds View Component
 *
 * Displays the card album for a specific world with interactive filters:
 * - World selector
 * - Rarity filters (Legendaria, Épica, Rara, Común)
 * - Card type filters (Héroe, Aliado, Villano)
 * - Two-way URL synchronization via query parameters (?mundo=...&rareza=...&tipo=...)
 *
 * @param {Object} props
 * @param {Object} props.texts - Localized text dictionary from API.
 * @param {Function} props.onNavigate - Navigation callback to switch between views.
 * @param {string} [props.initialWorld='neon'] - Initial world identifier fallback.
 * @returns {JSX.Element} The rendered Worlds catalog view.
 */
const Worlds = ({ texts, onNavigate, initialWorld = 'neon' }) => {
  // Localized texts corresponding to the album page and individual card badges
  const albumTexts = texts?.paginas?.albumMundo;
  const cromoTexts = texts?.components?.cromo;

  // Formats sorting dropdown options capitalizing the first letter
  const sortOptionsDesktop = Object.values(albumTexts?.orden?.opciones ?? {})
    .map(item => item[0].toUpperCase() + item.slice(1));

  // Parse query parameters from the browser URL for initial state hydration
  const urlParams = new URLSearchParams(window.location.search);

  // Active world state (hydrated from URL query param '?mundo' or defaults to initialWorld)
  const [currentWorld, setCurrentWorld] = useState(
    urlParams.get('mundo') ?? initialWorld
  );

  // Controls visibility toggle for the sort dropdown menu
  const [isSortMenuActive, setIsSortMenuActive] = useState(false);

  // Active sorting option state
  const [sortOption, setSortOption] = useState(sortOptionsDesktop[0]);

  // Active rarity filter state (hydrated from URL query param '?rareza')
  const [selectedRarity, setSelectedRarity] = useState(
    urlParams.get('rareza') ?? null
  );

  // Active card type filter state (hydrated from URL query param '?tipo')
  const [selectedType, setSelectedType] = useState(
    urlParams.get('tipo') ?? null
  );
  // Fetch full details and cards for the currently selected world
  const { mundos: world } = useMundos(currentWorld);

  // Fetch overview list of all six worlds for sidebar navigation
  const { mundos: worlds } = useMundos();

  // Synchronizes state changes back into the browser's URL query string in real time
  useEffect(() => {
    let params = new URLSearchParams();

    // Append active parameters only when they hold a valid value
    if (currentWorld) { params.set('mundo', currentWorld) }
    if (selectedRarity) { params.set('rareza', selectedRarity) }
    if (selectedType) { params.set('tipo', selectedType) }

    // Replace the URL without polluting the browser navigation history
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
    return () => { }
  }, [currentWorld, selectedRarity, selectedType])


  // Filters cards collection based on active rarity and type selections
  const displayedCards = world?.cromos?.filter((c) => {
    const matchesRarity = selectedRarity ? c.rareza === selectedRarity : true;
    const matchesType = selectedType ? c.tipo === selectedType : true;
    return matchesRarity && matchesType;
  });

  // Dynamic configuration of card types with dynamic count for the current world
  const TYPE_FILTERS = [
    { type: 'heroe', title: 'Héroe', quantity: world?.cromos?.reduce((q, current) => current.tipo === 'heroe' ? q + 1 : q, 0) },
    { type: 'aliado', title: 'Aliado', quantity: world?.cromos?.reduce((q, current) => current.tipo === 'aliado' ? q + 1 : q, 0) },
    { type: 'villano', title: 'Villano', quantity: world?.cromos?.reduce((q, current) => current.tipo === 'villano' ? q + 1 : q, 0) },
  ]

  // Helper strings for "All" options extracted from localized texts
  const allRaritiesWord = albumTexts?.filtros?.rareza?.todas?.split(':')[1]?.trim() ?? 'todas';
  const allRaritiesText = allRaritiesWord.charAt(0).toUpperCase() + allRaritiesWord.slice(1);
  const allTypesWord = albumTexts?.filtros?.tipo?.todos?.split(':')[1]?.trim() ?? 'todos';
  const allTypesText = allTypesWord.charAt(0).toUpperCase() + allTypesWord.slice(1);

  // Dropdown options lists combining "All" option with specific categories
  const rarityOptions = [
    allRaritiesText, // 👈 Ahora dirá solo "Todas"
    ...RARITY_FILTERS.map(r => r.label)
  ];
  const typeOptions = [
    allTypesText, // 👈 Ahora dirá solo "Todos"
    ...TYPE_FILTERS.map(t => albumTexts?.filtros?.tipo?.opciones?.[t.type] ?? t.title)
  ];

  // Dynamic label for rarity dropdown trigger button
  const currentRarityLabel = selectedRarity
    ? (albumTexts?.filtros?.rareza?.valor?.replace('{rareza}', RARITY_FILTERS.find(r => r.id === selectedRarity)?.label ?? selectedRarity))
    : (albumTexts?.filtros?.rareza?.todas ?? 'Rareza: todas');

  // Dynamic label for type dropdown trigger button
  const currentTypeLabel = selectedType
    ? (albumTexts?.filtros?.tipo?.valor?.replace('{tipo}', albumTexts?.filtros?.tipo?.opciones?.[selectedType] ?? selectedType))
    : (albumTexts?.filtros?.tipo?.todos ?? 'Tipo: todos');

  // Banner descriptive range text showing the world index (1-6) and card numbers (e.g. 001 - 020)
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
      {/* BANNER SECTION */}
      <div className={styles.worldsBanner} style={{ backgroundColor: world?.color }}>
        {/* Desktop Banner: Breadcrumbs, large world title, and card index range */}
        <div className={styles.desktopOnly}>
          {/* Breadcrumb for the current world selected */}
          <span className={`${styles.breadcrumb} body-s`}>
            <p className='body-s-bold'>{albumTexts?.migas?.inicio}</p>
            <ChevronDerIcon />
            <p>{world?.nombre}</p>
          </span>
          {/* Title */}
          <h1 className="heading-display">{world?.nombre}</h1>
          <span className={`${styles['header-text']} body-l`}>{headerText}</span>
        </div>
        {/* Mobile Header: Back button, compact world title and description */}
        <div className={styles.mobileHeader}>
          <Button
            variant="secondary"
            circle={true}
            size="s"
            className={styles.bannerButton}
            onClick={() => onNavigate('inicio')}
          >
            <FlechaIzqIcon />
          </Button>
          {/* Description of the world */}
          <div className={styles.mobileHeaderText}>
            <h1 className="heading-h3">{world?.nombre}</h1>
            <p className="detail-note" style={{ color: 'var(--text-inverse-soft)' }}>
              {world?.descripcion}
            </p>
          </div>
          {/* Search button */}
          <Button
            variant="secondary"
            circle={true}
            size="s"
            className={styles.bannerButton}
          >
            <BuscarIcon />
          </Button>
        </div>
      </div>
      {/* MAIN CONTENT: Sidebar filters (desktop) and Cards Grid */}
      <div className={styles.worldContent}>
        {/* Desktop Sidebar Filters */}
        <div className={styles.worldsFilters}>
          {/* Worlds Selector list */}
          <div className={styles.filterWorlds}>
            {/* Title */}
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
                    {/* Title of the world */}
                    <span className={styles.textWorld}>
                      <span className={styles.circleWorld} style={{ backgroundColor: `${w?.color}` }}></span>
                      <p
                        className={`
                          ${w?.id === currentWorld
                            ? 'body-s-bold'
                            : 'body-s'}
                          `}
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {w?.nombre}
                      </p>
                    </span>
                    {/* Number of cards */}
                    <p className="body-s-bold" style={
                      { color: `${w?.id === currentWorld ? `${w?.color}` : 'var(--text-secondary)'}` }}
                    >
                      {albumTexts?.mundos?.cromos?.replace('{cantidad}', w?.totalCromos) ?? `${w?.totalCromos} cromos`}
                    </p>
                  </span>
                  {/* Checks the current world selected and shows it */}
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
          {/* Rarity Filter list */}
          <div className={styles.rarityFilter}>
            {/* Title */}
            <h3 className="heading-h4">{albumTexts?.filtros?.rareza?.titulo ?? 'Filtrar por rareza'}</h3>
            <div className={styles.rarityList}>
              {RARITY_FILTERS.map(({ id, label, Icon }) => (
                <div
                  key={id}
                  // Shows which rarity has been selected
                  className={`
                    ${styles.rarityRow} 
                    ${selectedRarity === id ? styles.isActive : ''}
                  `}
                  onClick={() => setSelectedRarity(selectedRarity === id ? null : id)}
                >
                  {/* Badge to show the rarity */}
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
                  {/* Number of cards with specific rarity */}
                  <span className="body-s" style={{ color: 'var(--text-secondary)' }}>{
                    (world?.porRareza?.[id] ?? 0) > 1
                      ? albumTexts?.filtros?.cantidad?.otro?.replace('{cantidad}', world?.porRareza?.[id] ?? 0)
                      : albumTexts?.filtros?.cantidad?.uno?.replace('{cantidad}', world?.porRareza?.[id] ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Card Type Filter list */}
          <div className={styles.typeFilter}>
            <h3 className="heading-h4">{albumTexts?.filtros?.tipo?.titulo ?? 'Filtrar por tipo'}</h3>
            {TYPE_FILTERS.map(({ type, title, quantity }) => (
              <span
                key={type}
                // Shows which type has been selected
                className={`
                  ${styles.type} 
                  ${selectedType === type ? styles.isActive : ''}
                `}
                onClick={() => setSelectedType(selectedType === type ? null : type)}>
                {/* Title */}
                <p className="body-s-bold">{albumTexts?.filtros?.tipo?.opciones?.[type] ?? title}</p>
                {/* Number of cards with specific type */}
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
        {/* Cards Collection Area */}
        <div className={styles.worldsCardsContainer}>
          <div className={styles.dropdownFilter}>
            {/* Desktop Sort Dropdown */}
            <Dropdown
              trigger={
                <Button variant='secondary' size='s' onClick={() => setIsSortMenuActive(!isSortMenuActive)}>
                  {albumTexts?.orden?.etiqueta?.replace(
                    '{orden}', (sortOption || sortOptionsDesktop[0])?.toLowerCase()
                  )}
                  <ChevronAbajoIcon />
                </Button>
              }
              options={sortOptionsDesktop}
            />
          </div>

          {/* Mobile / Tablet Compact Filter Dropdowns */}
          <div className={styles.mobileFilters}>
            <Dropdown
              align="left"
              trigger={
                <Button variant="secondary" size="s">
                  {currentRarityLabel}
                  <ChevronAbajoIcon />
                </Button>
              }
              options={rarityOptions}
              onSelect={(label) => {
                if (label === allRaritiesText) {
                  setSelectedRarity(null);
                } else {
                  const match = RARITY_FILTERS.find(r => r.label === label);
                  setSelectedRarity(match ? match.id : null);
                }
              }}
            />
            <Dropdown
              align="left"
              trigger={
                <Button variant="secondary" size="s">
                  {currentTypeLabel}
                  <ChevronAbajoIcon />
                </Button>
              }
              options={typeOptions}
              onSelect={(title) => {
                if (title === allTypesText) {
                  setSelectedType(null);
                } else {
                  const match = TYPE_FILTERS.find(t => (albumTexts?.filtros?.tipo?.opciones?.[t.type] ?? t.title) === title);
                  setSelectedType(match ? match.type : null);
                }
              }}
            />
          </div>
          {/* Cards Grid Component */}
          <CardsGrid texts={texts} cards={displayedCards} />
        </div>
      </div>
    </>
  )
}

export default Worlds
