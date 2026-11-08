import React from 'react'

import styles from './CardsGrid.module.css'
import Card from '../Card/Card';

export const CardsGrid = ({ texts, cards }) => {
  
  return (
    <section className={styles.album}>
      {cards?.map((c) => (
        <Card key={c?.id} texts={texts} card={c} />
      ))}
    </section>
  )
}
