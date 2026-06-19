import { Newspaper } from 'lucide-react';
import styles from './EmptyState.module.css';

export default function EmptyState({ message = 'No news found matching your filters.' }) {
  return (
    <div className={styles.container}>
      <Newspaper size={40} className={styles.icon} />
      <h3 className={styles.heading}>No results</h3>
      <p className={styles.text}>{message}</p>
    </div>
  );
}
