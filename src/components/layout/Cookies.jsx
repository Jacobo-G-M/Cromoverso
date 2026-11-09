import React from 'react'

import styles from './Cookies.module.css'
import Button from '../ui/Button/Button'

export const Cookies = ({
  texts,
  onAccept,
  onReject,
}) => {
  return (
    <aside className={styles['banner-cookies']} >
      <div className={styles.cookiesTexts}>
        <h2 className='body-m-bold'>{texts?.banner?.titulo}</h2>
        <p className='body-s' style={{color: 'var(--text-secondary)'}}>{texts?.banner?.texto}</p>
      </div>
      <div className={styles.groupButtons}>
        <Button variant='primary' onClick={onAccept}>
          {texts?.banner?.botones?.aceptar}
        </Button>
        <Button variant='secondary' onClick={onReject}>
          {texts?.banner?.botones?.rechazar}
        </Button>
      </div>
    </aside>
  )
}
