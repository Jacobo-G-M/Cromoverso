// React core hook
import React from 'react'

// Styles and reusable UI components
import styles from './CardsGrid.module.css'
import Card from '../Card/Card';

/**
 * Cards Grid Component (Album Container)
 *
 * Renders a responsive CSS Grid displaying the list of cards
 * currently filtered in the active world album.
 *
 * @param {Object} props
 * @param {Object} props.texts - Localized text dictionary for card labels.
 * @param {Array<Object>} props.cards - List of card objects to render.
 * @returns {JSX.Element} The rendered grid container.
 */
export const CardsGrid = ({ texts, cards }) => {
  
  return (
    <section className={styles.album}>
      {cards?.map((c) => (
        <Card key={c?.id} texts={texts} card={c} />
      ))}
    </section>
  )
}
