import React from 'react'

import styles from './Footer.module.css'

import LogoInverso from '../../assets/logo/logo-inverso.svg?react'


const Footer = ({ texts }) => {
  const columns = Object.values(texts?.columnas ?? {});
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.brand}>
          <LogoInverso />
          <p className="body-s">
            {texts?.lema ?? 'Colecciona héroes originales de seis mundos. Explora cada mundo y conoce a sus héroes.'}
          </p>
        </div>
        <div className={styles.navColumns}>
          {columns.map((item, index) => (
            <div key={index} className={styles.column}>
              <span className="detail-label">{item?.titulo}</span>
              {Object.values(item?.enlaces).map((link) => (
                <a key={link} href={`/${link.toLowerCase()}`} className="body-s">{link}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.footerBottom}>
        <p className="detail-note">
          {texts?.legal?.derechos?.replace('{anio}', new Date().getFullYear())}
        </p>
      </div>
    </footer>
  )
}

export default Footer