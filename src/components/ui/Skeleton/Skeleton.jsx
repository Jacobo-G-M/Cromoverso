import styles from './Skeleton.module.css';

export const Skeleton = ({
  width,
  height,
  radius = 's',
  className = '',
  style,
}) => {
  return (
    <span
      className={`${styles.skeleton} ${styles[`radius-${radius}`]} ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
};
