import styles from './Spinner.module.css';

export const Spinner = ({ size = 'm', className = '' }) => {
  return (
    <span
      className={`${styles.spinner} ${styles[`size-${size}`]} ${className}`}
      aria-hidden="true"
    />
  );
};
