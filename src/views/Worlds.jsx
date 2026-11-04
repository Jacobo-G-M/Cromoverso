import React from 'react'

import styles from './Worlds.module.css'

const Worlds = ({ texts, onNavigate }) => {
  return (
    <>
      <section className={styles.worldsBanner}>
        <div className={styles.worldsFilters}></div>
        <div className={styles.worldsCardsContainer}></div>
      </section>
    </>
  )
}

export default Worlds
