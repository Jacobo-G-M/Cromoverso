import { Spinner } from '../Spinner/Spinner';
import styles from './LoadingOverlay.module.css';

export const LoadingOverlay = ({
  loading,
  label = 'Cargando…',
  children,
  className = '',
}) => {
  return (
    <div className={`${styles.wrapper} ${className}`} aria-busy={loading}>
      <div className={`${styles.content} ${loading ? styles.blurred : ''}`}>
        {children}
      </div>

      {loading && (
        <div className={styles.overlay} role="status" aria-live="polite">
          <div className={styles.badge}>
            <Spinner size="l" />
            {label && <p className="body-s-bold">{label}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
