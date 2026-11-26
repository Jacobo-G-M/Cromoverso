import { useEffect, useId } from 'react';
import { useCromos } from '../../hooks/useCromos';
import { useMundos } from '../../hooks/useMundos';
import { Dialog } from '../../components/ui/Dialog/Dialog';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import { StateMessage } from '../../components/ui/StateMessage/StateMessage';
import { Skeleton } from '../../components/ui/Skeleton/Skeleton';
import { LoadingOverlay } from '../../components/ui/LoadingOverlay/LoadingOverlay';

import CoronaIcon from '../../assets/icons/corona.svg?react';
import EstrellaIcon from '../../assets/icons/estrella.svg?react';
import RomboIcon from '../../assets/icons/rombo.svg?react';
import CirculoIcon from '../../assets/icons/circulo.svg?react';
import CerrarIcon from '../../assets/icons/cerrar.svg?react';
import RayoIcon from '../../assets/icons/rayo.svg?react';
import MundoIcon from '../../assets/icons/mundo.svg?react';
import DestellosIcon from '../../assets/icons/destellos.svg?react';
import LlamaIcon from '../../assets/icons/llama.svg?react';
import OjoIcon from '../../assets/icons/ojo.svg?react';
import ChevronIzqIcon from '../../assets/icons/chevronizq.svg?react';
import ChevronDerIcon from '../../assets/icons/chevronder.svg?react';

import styles from './CardDetail.module.css';

const RARITY_ICONS = {
  legendaria: CoronaIcon,
  epica: EstrellaIcon,
  rara: RomboIcon,
  comun: CirculoIcon,
};

const FIGURE_ICONS = {
  estrella: EstrellaIcon,
  rayo: RayoIcon,
  circulo: CirculoIcon,
  ola: MundoIcon,
  hoja: DestellosIcon,
  llama: LlamaIcon,
  orbita: MundoIcon,
  runa: OjoIcon,
};

const DEFAULT_ATTR_LABELS = {
  fuerza: 'Fuerza',
  velocidad: 'Velocidad',
  mente: 'Mente',
  energia: 'Energía',
};

const DEFAULT_TYPE_LABELS = {
  heroe: 'Héroe',
  aliado: 'Aliado',
  villano: 'Villano',
};

const DEFAULT_RARITY_LABELS = {
  comun: 'Común',
  rara: 'Rara',
  epica: 'Épica',
  legendaria: 'Legendaria',
};

const CardNeighbors = ({ worldId, currentCardId, onNavigate, navTexts }) => {
  const { mundos: world } = useMundos(worldId);

  const worldCards = Array.isArray(world?.cromos) ? world.cromos : [];
  const currentIndex = worldCards.findIndex((item) => item.id === currentCardId);
  const prevCard = currentIndex > 0 ? worldCards[currentIndex - 1] : null;
  const nextCard = currentIndex >= 0 && currentIndex < worldCards.length - 1
    ? worldCards[currentIndex + 1]
    : null;

  if (!prevCard && !nextCard) return null;

  return (
    <nav className={styles.navFooter} aria-label={navTexts?.anterior && navTexts?.siguiente ? `${navTexts.anterior} / ${navTexts.siguiente}` : 'Navegación entre cromos'}>
      {prevCard ? (
        <button
          type="button"
          className={`${styles.navLink} detail-note-bold`}
          aria-label={`${navTexts?.anterior ?? 'Cromo anterior'}: ${prevCard.nombre}`}
          onClick={() => onNavigate('cromo', prevCard.id)}
        >
          <ChevronIzqIcon />
          <span>{`${String(prevCard.numero).padStart(3, '0')} ${prevCard.nombre}`}</span>
        </button>
      ) : (
        <span />
      )}

      {nextCard && (
        <button
          type="button"
          className={`${styles.navLink} detail-note-bold`}
          aria-label={`${navTexts?.siguiente ?? 'Cromo siguiente'}: ${nextCard.nombre}`}
          onClick={() => onNavigate('cromo', nextCard.id)}
        >
          <span>{`${String(nextCard.numero).padStart(3, '0')} ${nextCard.nombre}`}</span>
          <ChevronDerIcon />
        </button>
      )}
    </nav>
  );
};

export const CardDetail = ({ cardId, onClose, onNavigate, texts }) => {
  const { card, loading, error, errorCode, notFound, refresh } = useCromos(cardId);

  const titleId = useId();
  const detailTexts = texts?.paginas?.detalleCromo;
  const cromoTexts = texts?.componentes?.cromo;
  const stateTexts = texts?.estados;
  const errorTexts = texts?.errores;

  useEffect(() => {
    if (!card && !notFound) return;

    const previousTitle = document.title;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    const previousDescription = metaDescription.content;

    if (notFound) {
      const notFoundTitle = detailTexts?.noEncontrado?.titulo ?? 'No encontramos este cromo';
      document.title = `${notFoundTitle} · Cromoverso`;
      metaDescription.content = detailTexts?.noEncontrado?.texto ?? 'Puede que el número esté mal escrito.';
    } else if (card) {
      document.title = (detailTexts?.seo?.titulo ?? '{nombre} · Cromoverso')
        .replace('{nombre}', card.nombre);
      metaDescription.content = (detailTexts?.seo?.descripcion ?? '{poder}')
        .replace('{poder}', card.poder ?? '')
        .replace('{nombre}', card.nombre ?? '');
    }

    return () => {
      document.title = previousTitle;
      metaDescription.content = previousDescription;
    };
  }, [card, notFound, detailTexts]);

  const RarityIcon = RARITY_ICONS[card?.rareza] ?? CirculoIcon;
  const FigureIcon = FIGURE_ICONS[card?.ilustracion?.figura] ?? RayoIcon;
  const rarityLabel = cromoTexts?.rarezas?.[card?.rareza] ?? DEFAULT_RARITY_LABELS[card?.rareza] ?? card?.rareza;
  const typeLabel = detailTexts?.encabezado?.tipos?.[card?.tipo] ?? DEFAULT_TYPE_LABELS[card?.tipo] ?? card?.tipo;

  const locationText = (detailTexts?.encabezado?.ubicacion ?? '{id} · {mundo}, posición {posicion}')
    .replace('{id}', card?.id ?? '')
    .replace('{mundo}', card?.mundoNombre ?? '')
    .replace('{posicion}', card?.posicion ?? card?.numero ?? '');

  const attributeEntries = Object.entries(card?.atributos ?? {});
  const totalAttributes = attributeEntries.reduce((acc, [, value]) => acc + Number(value || 0), 0);

  return (
    <Dialog
      open={Boolean(cardId)}
      onClose={onClose}
      ariaLabelledBy={titleId}
      className={styles.dialog}
    >
      {!loading && notFound && (
        <div className={styles.stateBox}>
          <p className="heading-giant" aria-hidden="true">404</p>
          <h2 id={titleId} className="heading-h2">
            {detailTexts?.noEncontrado?.titulo ?? stateTexts?.noEncontrado?.titulo ?? 'No encontramos este cromo'}
          </h2>
          <p className="body-m" style={{ color: 'var(--text-secondary)' }}>
            {detailTexts?.noEncontrado?.texto ?? errorTexts?.no_encontrado ?? 'Puede que el número esté mal escrito.'}
          </p>
          <Button onClick={onClose} variant="primary" size="m">
            {detailTexts?.noEncontrado?.botones?.volver ?? 'Volver a los mundos'}
          </Button>
        </div>
      )}

      {!loading && error && (
        <StateMessage
          variant="error"
          titleId={titleId}
          className={styles.modalState}
          title={stateTexts?.error?.titulo ?? 'No se pudo cargar'}
          description={
            errorTexts?.[errorCode] ??
            stateTexts?.error?.texto ??
            errorTexts?.generico ??
            'Algo falló al pedir los datos. Vuelve a intentarlo en unos segundos.'
          }
          actionLabel={stateTexts?.error?.botones?.reintentar ?? 'Reintentar'}
          onAction={refresh}
          secondaryActionLabel={detailTexts?.botones?.cerrar ?? 'Cerrar'}
          onSecondaryAction={onClose}
        />
      )}

      {(loading || (!notFound && !error && card)) && (
        <LoadingOverlay loading={loading} label={stateTexts?.cargando ?? 'Cargando…'}>
          {card ? (
            <div className={styles.container}>
          <div className={styles.mobileTopBar}>
            <span className={styles.dragHandle} aria-hidden="true" />
            <Button
              variant="secondary"
              circle={true}
              size="s"
              className={styles.mobileCloseButton}
              aria-label={detailTexts?.botones?.cerrar ?? 'Cerrar'}
              onClick={onClose}
            >
              <CerrarIcon />
            </Button>
          </div>

          <div
            className={`${styles.containerLeft} ${styles[`world-${card.mundo}`]}`}
            style={card?.ilustracion?.colorBase ? { backgroundColor: card.ilustracion.colorBase } : undefined}
          >
            <div className={styles.cardWrapper}>
              <Card
                texts={texts}
                card={card}
                size="l"
              />
            </div>

            <div className={styles.mobileCardMeta}>
              <p className={`${styles.mobileCardId} data-card-number`}>{card.id}</p>
              <p className="heading-h3" aria-hidden="true">{card.nombre}</p>
              <p className={`${styles.mobileCardSubtitle} body-s`}>
                {`${card.mundoNombre} · ${typeLabel}`}
              </p>
              <span className={`${styles.pill} ${styles.rarityPill} ${styles[`rarity-${card.rareza}`]}`}>
                <RarityIcon />
                <span className="detail-label">{rarityLabel}</span>
              </span>
            </div>
          </div>

          <div className={styles.containerRight}>
            <div className={styles.topBar}>
              <div className={styles.pills}>
                <span className={`${styles.pill} ${styles.rarityPill} ${styles[`rarity-${card.rareza}`]}`}>
                  <RarityIcon />
                  <span className="detail-label">{rarityLabel}</span>
                </span>
                <span className={`${styles.pill} ${styles.worldPill} ${styles[`world-soft-${card.mundo}`]}`}>
                  <span className="detail-note-bold">{card.mundoNombre}</span>
                </span>
                <span className={`${styles.pill} ${styles.typePill}`}>
                  <span className="detail-note-bold">{typeLabel}</span>
                </span>
              </div>

              <Button
                variant="secondary"
                circle={true}
                size="s"
                className={styles.closeButton}
                aria-label={detailTexts?.botones?.cerrar ?? 'Cerrar'}
                onClick={onClose}
              >
                <CerrarIcon />
              </Button>
            </div>

            <div className={styles.header}>
              <p className={`${styles.location} detail-note-bold`}>{locationText}</p>
              <h2 id={titleId} className="heading-h1">{card.nombre}</h2>
            </div>

            <div className={`${styles.powerBox} ${styles[`world-soft-${card.mundo}`]}`}>
              <span
                className={styles.powerIcon}
                style={card?.ilustracion?.colorBase ? { backgroundColor: card.ilustracion.colorBase } : undefined}
                aria-hidden="true"
              >
                <FigureIcon />
              </span>
              <div className={styles.powerText}>
                <div className={styles.powerLabelRow}>
                  <span
                    className={styles.mobilePowerIcon}
                    style={card?.ilustracion?.colorBase ? { color: card.ilustracion.colorBase } : undefined}
                    aria-hidden="true"
                  >
                    <FigureIcon />
                  </span>
                  <span
                    className={`${styles.powerLabel} detail-label`}
                    style={card?.ilustracion?.colorBase ? { color: card.ilustracion.colorBase } : undefined}
                  >
                    {detailTexts?.poder?.titulo ?? 'Poder'}
                  </span>
                </div>
                <p className="body-m-bold">{card.poder}</p>
              </div>
            </div>

            <p className={`${styles.description} body-m`}>{card.descripcion}</p>

            <section className={styles.attributesBox} aria-label={detailTexts?.atributos?.titulo ?? 'Atributos'}>
              <div className={styles.attributesHeader}>
                <h3 className="heading-h4">{detailTexts?.atributos?.titulo ?? 'Atributos'}</h3>
                <span className={`${styles.attributesTotal} body-s-bold`}>
                  {(detailTexts?.atributos?.total ?? 'Total {total}').replace('{total}', totalAttributes)}
                </span>
              </div>

              <div className={styles.attributesList}>
                {attributeEntries.map(([key, value]) => {
                  const attrLabel = detailTexts?.atributos?.nombres?.[key] ?? DEFAULT_ATTR_LABELS[key] ?? key;
                  const numericValue = Number(value) || 0;
                  const widthPercent = Math.min(100, Math.max(0, numericValue));

                  return (
                    <div key={key} className={styles.attributeRow}>
                      <span className="body-s-bold">{attrLabel}</span>
                      <div
                        className={styles.barTrack}
                        role="progressbar"
                        aria-label={attrLabel}
                        aria-valuenow={numericValue}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={styles.barFill}
                          style={{
                            width: `${widthPercent}%`,
                            backgroundColor: card?.ilustracion?.colorBase || 'var(--brand-primary)',
                          }}
                        />
                      </div>
                      <span className={`${styles.attributeValue} body-s-bold`}>{numericValue}</span>
                    </div>
                  );
                })}
              </div>

              <p className={`${styles.attributesScale} detail-note`}>
                {detailTexts?.atributos?.escala ?? 'Escala de 10 a 99.'}
              </p>
            </section>

            {card.mundo && (
              <CardNeighbors
                worldId={card.mundo}
                currentCardId={card.id}
                onNavigate={onNavigate}
                navTexts={detailTexts?.navegacion}
              />
            )}
          </div>
        </div>
          ) : (
            <div className={styles.skeletonLayout} aria-hidden="true">
              <Skeleton className={styles.skeletonCardBox} radius="l" />
              <div className={styles.skeletonRight}>
                <div className={styles.skeletonPills}>
                  <Skeleton width="84px" height="28px" radius="pill" />
                  <Skeleton width="96px" height="28px" radius="pill" />
                  <Skeleton width="72px" height="28px" radius="pill" />
                </div>
                <Skeleton width="60%" height="40px" radius="s" />
                <Skeleton width="100%" height="68px" radius="m" />
                <Skeleton width="90%" height="44px" radius="s" />
                <div className={styles.skeletonAttrs}>
                  <Skeleton width="100%" height="14px" radius="pill" />
                  <Skeleton width="100%" height="14px" radius="pill" />
                  <Skeleton width="100%" height="14px" radius="pill" />
                  <Skeleton width="100%" height="14px" radius="pill" />
                </div>
              </div>
            </div>
          )}
        </LoadingOverlay>
      )}
    </Dialog>
  );
};
