import Button from '../Button/Button';
import AlertaIcon from '../../../assets/icons/alerta.svg?react';
import BuscarIcon from '../../../assets/icons/buscar.svg?react';

import styles from './StateMessage.module.css';

export const StateMessage = ({
  variant = 'empty',
  title,
  description,
  titleId,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  const isError = variant === 'error';
  const Icon = isError ? AlertaIcon : BuscarIcon;

  return (
    <section
      className={`${styles.stateBox} ${isError ? styles.error : styles.empty} ${className}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      <span className={styles.iconBadge} aria-hidden="true">
        <Icon />
      </span>
      <div className={styles.copy}>
        <h3 id={titleId} className="heading-h3">
          {title}
        </h3>
        {description && (
          <p className={`${styles.description} body-m`}>
            {description}
          </p>
        )}
      </div>
      {(actionLabel || secondaryActionLabel) && (
        <div className={styles.actions}>
          {actionLabel && onAction && (
            <Button variant="primary" size="m" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="secondary" size="m" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </section>
  );
};
