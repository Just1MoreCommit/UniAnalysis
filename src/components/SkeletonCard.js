import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.circle} />
      <div className={styles.lines}>
        <div className={styles.line} style={{ width: '70%' }} />
        <div className={`${styles.line} ${styles.lineShort}`} />
      </div>
    </div>
  );
}
