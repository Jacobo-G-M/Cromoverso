// React core hook
import React from 'react'

// Styles and reusable UI components
import styles from './Cookies.module.css'
import Button from '../ui/Button/Button'

/**
 * Cookie Consent Floating Banner Component
 *
 * Displays a non-intrusive floating notice at the bottom of the viewport
 * prompting first-time visitors to accept all or reject non-essential cookies.
 *
 * @param {Object} props
 * @param {Object} props.texts - Localized text copy for cookie banner.
 * @param {Function} props.onAccept - Callback triggered when accepting all cookies.
 * @param {Function} props.onReject - Callback triggered when rejecting optional cookies.
 * @returns {JSX.Element} The floating cookie banner notice.
 */
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
      {/* Action buttons: Accept All vs. Reject Optional */}
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
